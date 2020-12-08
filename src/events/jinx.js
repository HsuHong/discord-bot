const Discord = require('discord.js')

var oldmsg = undefined
module.exports = function(client, message){
    if (oldmsg == undefined) oldmsg = message
    else {
        if (oldmsg.content.toLowerCase() == message.content.toLowerCase()){
            message.channel.send('https://cdn.discordapp.com/emojis/755280811447812127.png?v=1')
        }
        oldmsg = message
    }
}