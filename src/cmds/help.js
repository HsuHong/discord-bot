const Discord = require('discord.js')
const fs = require('fs')

function randomItem(array) {
    return array[Math.floor(Math.random() * array.length)];
}

module.exports = function(client, message, prefix, config){
    if (message.content.toLowerCase().startsWith(prefix + 'help')){
        const randommsgs = JSON.parse(fs.readFileSync('./data/help_greet_user.json'))
        let randommsg = randomItem(randommsgs)
    
        let embed = new Discord.MessageEmbed()
    
        embed.setAuthor(client.user.username, client.user.displayAvatarURL)
        .setColor('#000F42')
        .setDescription(`Hey ${message.author.username}! ` + randommsg + '\nAnyway, here\'s some commands!')
    
        embed.addField(prefix + 'sots', 'Spirit of Two Sisters...', true)
        embed.addField(prefix + 'mention', 'Custom responses when you mention the bot', true)
        if (config.twitter.posters.includes(message.author.id)) embed.addField(prefix + 'tweet', 'Post a tweet to Arendelle Odyssey Twitter', true)
        if (message.author.id == config.discord.owner_id) embed.addField(prefix + 'update', '[Owner] Update the bot from git repo', true)
        if (message.author.id == config.discord.owner_id) embed.addField(prefix + 'eval', '[Owner] Evaluate JS', true)
        if (message.author.id == config.discord.owner_id) embed.addField(prefix + 'ssh', '[Owner] Evaluate shell command', true)
        if (message.author.id == config.discord.owner_id) embed.addField(prefix + 'sql', '[Owner] Evaluate SQL command in bot\'s database', true)

        message.channel.send(embed)
    }
}