const Discord = require('discord.js')

module.exports = function(message, client, prefix, config, sql){
    const command = prefix + 'event'
    if (message.content.toLowerCase().startsWith(command)){
        let args = message.content.split(" ");
        args.shift();

        if (args.length < 1) {
            
            let embed = new Discord.MessageEmbed()
            embed.setTitle('Usage of ' + command)
            .setColor('RANDOM')
            .setDescription('Create and show any events for AO. You can see the list [here](https://bot.arendelleodyssey.com/events)')
            .addField(command + ' show', 'Show lastest (current or not) event.\nYou can put an ID to show specific event', true)
            if (message.member.roles.cache.find(r => r.id === "729083781062983702")) embed.addField(command + ' create', '[ST only] Create new event', true)

            return message.channel.send(embed)
        }
        if (args[0].toLowerCase() == 'show') return require('./show-event.js')(message, args, command, client, prefix, config, sql)
        if (args[0].toLowerCase() == 'create'){
            if (message.member.roles.cache.find(r => r.id === "729083781062983702")){
                require('./create-event.js')(message, args, command, client, prefix, config, sql)
            } else {
                message.channel.send(`<@${message.author.id}>, Nah you can't create events`)
            }
            return
        } 
    }
}