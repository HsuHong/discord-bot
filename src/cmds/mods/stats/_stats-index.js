const Discord = require('discord.js')

function outputList(message, client, prefix){
    let embed = new Discord.MessageEmbed
    embed.setTitle(client.user.username + '\'s stats')
    .addField(`${prefix}stat custommsg`, 'Show number of custom messages by user with bot mention')
    message.channel.send(embed)
    return
}

module.exports = function(message, client, prefix, config, sql){
    if (message.content.toLowerCase().startsWith(prefix + 'stat')){
        if (message.member.hasPermission('MANAGE_MESSAGES')){
            var args = message.content.split(" ").slice(1);
            if (args.length > 0){
                try{
                    require('./'+args[0].toLowerCase()+'.js')(message, client, prefix, config, sql)
                } catch (err){
                    outputList(message, client, prefix)
                }
            } else outputList(message, client, prefix)
        } else return
    }
}