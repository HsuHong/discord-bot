const Discord = require('discord.js');

module.exports = function(client, message, prefix, config, sql){
    if (message.content.startsWith(prefix + 'customlist')) {
        try {
            sql.query("SELECT DISTINCT `command-name`, `user` FROM `mention_responses` ORDER BY `command-name`", (err, result)=>{
                if (err){
                    console.error(err)
                    message.channel.send(':negative_squared_cross_mark: ' + message.author.username + ', an error has been happened. This is reported.')
                    client.users.cache.find(u => u.id == config.discord.owner_id).send(`:warning: Error fetching custom mention list msg: \`\`\`${err}\`\`\``)
                  } else {
                    var list = []
                    result.forEach(r=>{
                        var command = r['command-name']
                        var username = client.users.cache.get(r.user).username
                        if (username == undefined) username = 'Username not found 🤦‍♂️'
                        list.push(`\`${prefix}${command}\` - ${username}`)
                    })
                    let embed = new Discord.MessageEmbed
                    embed.setTitle('User\'s command list:')
                    .setColor('#00FF22')
                    .setDescription(list.join('\n'))
                    message.channel.send(embed)
                }
            })
        } catch (err) {
            message.channel.send('Uh uh... I am lost (maybe in the woods)')
            console.error(err)
        }
    }
}