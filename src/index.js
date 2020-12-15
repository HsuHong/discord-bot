const fs = require('fs')
const config = JSON.parse(fs.readFileSync('./data/config.json'))
const Discord = require('discord.js')
const client = new Discord.Client()
const wait = require('util').promisify(setTimeout);

const MySQL = require('mysql')
const sql = MySQL.createConnection({
    host     : config.mysql.host,
    user     : config.mysql.user,
    password : config.mysql.password,
    database : config.mysql.database
})
sql.query('SHOW TABLES', async function (error, results, fields) {
    if (error) throw error;
    if (results.length == 0){
        console.log('[SQL] No tables are set in the database')
        await require('./sqlScripts/create-tables.js')(sql, client)
    }
});
const Twitter = require('twitter-lite')

const DiscordGiveaways = require("discord-giveaways");
sql.query('SELECT * FROM `giveaways`', (err, res) => {
    if (err) {
        console.error(err)
    }
    if (!res[0].data || res[0].data == "") {
        sql.query('INSERT INTO `giveaways` (`data`) VALUES (`[]`)', (err, res) => {
            if (err) {
                console.error(err)
            }
            console.log('[SQL] Created data for giveaway table')
        })
    } 
})
const GiveawayManager = class extends DiscordGiveaways.GiveawaysManager {
    async getAllGiveaways(){
        sql.query('SELECT `data` FROM `giveaways`', (err, res) => {
            if (err) {
                console.error(err)
                return false
            }
            return JSON.parse(res[0].data)
        })
    }
    async saveGiveaway(messageID, giveawayData){
        sql.query('SELECT `data` FROM `giveaways`', (err, res) => {
            if (err) {
                console.error(err)
                return false
            }
            var newdata = JSON.parse(res[0].data)
            newdata.push(giveawayData)
            sql.query('UPDATE `giveaways` SET `data` = ? WHERE `id` = 1;', JSON.stringify(newdata), (err, res) => {
                if (err) {
                    console.error(err)
                    return false
                }
                return true
            })
        })
    }
    async editGiveaway(messageID, giveawayData){
        sql.query('SELECT `data` FROM `giveaways`', (err, res) => {
            if (err) {
                console.error(err)
                return false
            }
            var newdata = JSON.parse(res[0].data).filter((giveaway) => giveaway.messageID !== messageID)
            newdata.push(giveawayData)
            sql.query('UPDATE `giveaways` SET `data` = ? WHERE `id` = 1;', JSON.stringify(newdata), (err, res) => {
                if (err) {
                    console.error(err)
                    return falsae
                }
                return true
            })
        })
    }
    async deleteGiveaway(messageID){
        sql.query('SELECT `data` FROM `giveaways`', (err, res) => {
            if (err) {
                console.error(err)
                return false
            }
            var newdata = JSON.parse(res[0].data).filter((giveaway) => giveaway.messageID !== messageID)
            sql.query('UPDATE `giveaways` SET `data` = ? WHERE `id` = 1;', JSON.stringify(newdata), (err, res) => {
                if (err) {
                    console.error(err)
                    return false
                }
                return true
            })
        })
    }
};
const giveawaysManager = new GiveawayManager(client, {
    storage: false,
    updateCountdownEvery: 20 * 1000,
    default: {
        botsCanWin: false,
        embedColor: "#FF0000",
        reaction: "<a:RainbowHype:747087403554045962>"
    }
});
client.giveawaysManager = giveawaysManager;

const execArgs = process.argv;
if (execArgs.includes('-d')) {
    console.log('Started as Dev bot')
    client.login(config.discord.token_beta)
}
else {
    console.log('Started as normal')
    client.login(config.discord.token)
}

client.on('ready', async () => {
    await wait(1000);

    console.log(`Logged in as ${client.user.tag}`)

    sql.connect(()=>{
        console.log('[SQL] Connected to the MySQL server!')
    })

    // start express server
    require('./web-express/exp-srv.js')(client, config, sql)

    if (client.user.id == config.discord.bot_id){
        const twitter_client = new Twitter({
            consumer_key:        config.twitter.consumer_key,
            consumer_secret:     config.twitter.consumer_secret,
            access_token_key:    config.twitter.access_token_key,
            access_token_secret: config.twitter.access_token_secret,
        });

        client.user.setActivity(config.discord.prefix + 'help', { type: 'WATCHING' })
        client.user.setStatus('online')
        
        // Read @ArendelleO Tweets
        require('./events/twitter/streaming-tweets.js')(twitter_client, client, config, sql)

        // Read @arendelleodyssey IG posts
        //var old_ig_id = undefined
        //require('./events/instagram/streaming-ig.js')(client, config, old_ig_id)

        // Check new youtube posts
        require('./events/youtube/streaming-yt.js')(client, config)

    } else if (client.user.id == config.discord.bot_id_beta) {
        client.user.setActivity(config.discord.prefix_beta + 'help', { type: 'LISTENING' })
        client.user.setStatus('idle')
    }
})

client.on('message', message => {
    // Set bot's prefix (if bot is prod bot or dev bot)
    var prefix
    if (client.user.id == config.discord.bot_id){
        prefix = config.discord.prefix
    } else if (client.user.id == config.discord.bot_id_beta) {
        prefix = config.discord.prefix_beta
    }

    // Jinx!
    require('./events/jinx.js')(client, message)

    // Auto publisher messages (API from https://github.com/Forcellrus/Discord-Auto-Publisher but simplified for one server)
    require('./events/auto-publish.js')(client, message, config)

    if (message.author.bot) return
    require('./cmds/import_cmds.js')(client, message, prefix, config, sql)
})