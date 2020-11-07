const Discord = require('discord.js')
const fs = require('fs')

function randomItem(array) {
    return array[Math.floor(Math.random() * array.length)];
}

module.exports = function(client, message, prefix, config){
    if (message.content.toLowerCase().startsWith(`<@${client.user.id}>`) || message.content.toLowerCase().startsWith(`<@!${client.user.id}>`)){
        const randommsgs = JSON.parse(fs.readFileSync('./data/bot_mention_reponses.json'))
        for (var authorid in randommsgs) {
            var authorid_comp = authorid
            if (message.author.id === authorid_comp) {
                message.channel.send(randomItem(randommsgs[authorid]))
            }
        }
    }
}