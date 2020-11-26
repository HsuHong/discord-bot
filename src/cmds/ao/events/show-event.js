const Discord = require('discord.js')
module.exports = function(message, args, command, client, prefix, config, sql){
    sql.query("SELECT * FROM events ORDER BY date_start DESC LIMIT 1", (err, res) =>{
        if (err) {
            console.error(err)
            message.channel.send('Error :/\n' + err)
        }
        let embed = new Discord.MessageEmbed()
        embed.setTitle(res[0].name)
        if (res[0].description != null) embed.setDescription(res[0].description)
        embed.addField('Start date', new Date(res[0].date_start).parse())
        if (res[0].date_end != null) embed.addField('End date', new Date(res[0].date_end).parse())
        embed.setFooter('ID: ' + res[0].id)
        message.channel.send(embed)
    })
}