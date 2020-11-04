const fs = require('fs')
const config = JSON.parse(fs.readFileSync('./data/config.json'))
const Discord = require('discord.js')
const client = new Discord.Client()
const Twitter = require('twitter-lite')
const twitter_client = new Twitter({
    consumer_key:        config.twitter.consumer_key,
    consumer_secret:     config.twitter.consumer_secret,
    access_token_key:    config.twitter.access_token_key,
    access_token_secret: config.twitter.access_token_secret,
});

client.login(config.discord.token)

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}`)
    client.user.setActivity(config.discord.prefix + 'help', { type: 'WATCHING' })
    
    // Read @ArendelleO Tweets
    require('./events/twitter/streaming-tweets.js')(twitter_client, client, config)

    // Read @arendelleodyssey IG posts
    var old_ig_id = undefined
    require('./events/instagram/streaming-ig.js')(client, config, old_ig_id)
})

client.on('message', message => {
    if (message.author.bot) return

    require('./cmds/import_cmds.js')(client, message, config.discord.prefix, config)
})