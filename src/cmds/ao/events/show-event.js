const Discord = require('discord.js')
module.exports = function(message, args, command, client, prefix, config, sql){
    var monthNames = [undefined,'January','February','March','April','May','June','July','August','September','October','November','December']
    if (args[1]){
        sql.query("SELECT * FROM events WHERE id = ? OR name LIKE ?", [args[1], args[1]], (err, res) =>{
            if (err) {
                console.error(err)
                message.channel.send('Error :/\n' + err)
            }
            if (res.length < 1) return message.channel.send('No events found with this id')
            
            let [startMonth, startDate, startYear] = new Date(res[0].date_start).toLocaleDateString("en-US").split("/")
    
            let embed = new Discord.MessageEmbed()
            embed.setTitle(res[0].name)
            .setColor('#00FF00')
            if (res[0].description != null) embed.setDescription(res[0].description)
            embed.addField('Start date', `${monthNames[startMonth]} ${startDate}, ${startYear}`, true)
            if (res[0].date_end != null) {
                let [endMonth, endDate, endYear] = new Date().toLocaleDateString("en-US").split("/")
                embed.addField('End date', `${monthNames[endMonth]} ${endDate}, ${endYear}`, true)
            }
            embed.setFooter('ID: ' + res[0].id + ' | Starts:')
            embed.setTimestamp(res[0].date_start)
            message.channel.send(embed)
        })
    } else {
        sql.query("SELECT * FROM events ORDER BY date_start DESC LIMIT 1", (err, res) =>{
            if (err) {
                console.error(err)
                message.channel.send('Error :/\n' + err)
            }
            if (res.length < 1) return message.channel.send('No events found with this id')
            
            let [startMonth, startDate, startYear] = new Date(res[0].date_start).toLocaleDateString("en-US").split("/")
    
            let embed = new Discord.MessageEmbed()
            embed.setTitle(res[0].name)
            .setColor('#00FF00')
            if (res[0].description != null) embed.setDescription(res[0].description)
            embed.addField('Start date', `${monthNames[startMonth]} ${startDate}, ${startYear}`, true)
            if (res[0].date_end != null) {
                let [endMonth, endDate, endYear] = new Date().toLocaleDateString("en-US").split("/")
                embed.addField('End date', `${monthNames[endMonth]} ${endDate}, ${endYear}`, true)
            }
            embed.setFooter('ID: ' + res[0].id + ' | Starts:')
            embed.setTimestamp(res[0].date_start)
            message.channel.send(embed)
        })
    }
}