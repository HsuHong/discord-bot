const fs = require('fs')
const config = JSON.parse(fs.readFileSync('./data/config.json'))
const Discord = require('discord.js')
const client = new Discord.Client()

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

const execArgs = process.argv;
if (execArgs.includes('-d')) {
    console.log('Started as Dev bot')
    client.login(config.discord.token_beta)
}
else {
    console.log('Started as normal')
    client.login(config.discord.token)
}

client.on('ready', () => {
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

    // Auto publisher messages (API from https://github.com/Forcellrus/Discord-Auto-Publisher but simplified for one server)
    require('./events/auto-publish.js')(client, message, config)

    if (message.author.bot) return
    require('./cmds/import_cmds.js')(client, message, prefix, config)
})