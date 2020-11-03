const fs = require('fs')
const config = JSON.parse(fs.readFileSync('./data/config.json'))
const Discord = require('discord.js')
const client = new Discord.Client()
const Twitter = require('twitter')
const twitter_client = new Twitter({
    consumer_key:        config.twitter.consumer_key,
    consumer_secret:     config.twitter.consumer_secret,
    access_token_key:    config.twitter.access_token_key,
    access_token_secret: config.twitter.access_token_secret,
});

client.login(config.discord.token)

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}`)
    
    // Read @ArendelleO Tweets
    require('./twitter/streaming-tweets.js')(twitter_client, client, config)
})

client.on('message', message => {
    if (message.author.bot) return

    require('./cmds/import_cmds.js')(client, message, config.discord.prefix, config, twitter_client)
})