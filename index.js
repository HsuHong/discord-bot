const Discord = require('discord.js')
const client = new Discord.Client()
const fs = require('fs')
const config = JSON.parse(fs.readFileSync('./data/config.json'))
client.login(config.discord.token)

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}`)
    
    // Read @ArendelleO Tweets
    const twitterStreaming = require('./twitter/streaming-tweets.js')
    twitterStreaming(client, config)
})

client.on('message', message => {
    const prefix = '!'
    
})