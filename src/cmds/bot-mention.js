const Discord = require('discord.js')
const fs = require('fs')

function randomItem(array) {
    return array[Math.floor(Math.random() * array.length)];
}

module.exports = function(client, message, prefix, config, sql){
    if (message.content.toLowerCase().startsWith(prefix + 'mention')){
        let args = message.content.split(" ");
        args.shift();
        if (args.length < 1) return function(){
            let embed = new Discord.MessageEmbed
            embed.setColor('RANDOM')
            .setTitle('Custom text when you mention ' + client.user.username)
            .setDescription(`${client.user.username} can respond with a random custom message defined by yourself when you mention the bot at the beginning on a message.`)
            .addField('To set it up:', `\`${prefix}mention add [message]\` - Create and store your custom message, it will return an ID that it will be useful for removing the message. You can create unlimited messages, the bot will return a random message`)
            .addField('Removing a message', `\`${prefix}mention remove [ID]\` - Removes the message with the ID, it will be deleted from the bot\'s database`)
            .addField('List your messages:', `\`${prefix}mention list\` - The bot will send you a DM with a file containig all the messages you registed *(GDPR)*`)
            message.channel.send(embed)
        }
        if (args[0].toLowerCase() == 'add'){
            args.shift()
            if (args.length < 1) return message.channel.send(message.author.username + ', I need a message!')
            sql.query("INSERT INTO `mention_responses` (`user`, `message`) VALUES (?, ?)",[message.author.id, args.join(' ')] , (err, result)=>{
                if (err){
                  console.error(err)
                  message.channel.send(':negative_squared_cross_mark: ' + message.author.username + ', an error has been happened. This is reported.')
                  client.users.cache.find(u => u.id == config.discord.owner_id).send(`:warning: Error adding custom mention msg: \`\`\`${err}\`\`\``)
                } else {
                  message.channel.send(':white_check_mark: ' + message.author.username + `, your message has been added! The ID of this message is \`${result.insertId}\``)
                }
            })
        } else if (args[0].toLowerCase() == 'remove'){
            args.shift()
            if (args.length < 1) return message.channel.send(message.author.username + ', I need the ID!')
            sql.query("SELECT `message` FROM `mention_responses` WHERE `id` = ?", args[0], (err, result)=>{
                if (err){
                  console.error(err)
                  message.channel.send(':negative_squared_cross_mark: ' + message.author.username + ', an error has been happened. This is reported.')
                  client.users.cache.find(u => u.id == config.discord.owner_id).send(`:warning: Error removing custom mention msg: \`\`\`${err}\`\`\``)
                } else {
                    var message = result[0].message
                    sql.query("DELETE FROM `mention_responses` WHERE `id` = ?", args[0], (err, result)=>{
                        if (err){
                          console.error(err)
                          message.channel.send(':negative_squared_cross_mark: ' + message.author.username + ', an error has been happened. This is reported.')
                          client.users.cache.find(u => u.id == config.discord.owner_id).send(`:warning: Error removing custom mention msg: \`\`\`${err}\`\`\``)
                        } else {
                            var message = result[0].message
                            message.channel.send(':white_check_mark: ' + message.author.username + `, your message "${message}" has been removed!`)
                        }
                    })
                }
            })
        } else if (args[0].toLowerCase() == 'list'){
            sql.query("SELECT * FROM `mention_responses` WHERE `user` = ?", message.author.id, (err, result)=>{
                if (err){
                  console.error(err)
                  message.channel.send(':negative_squared_cross_mark: ' + message.author.username + ', an error has been happened. This is reported.')
                  client.users.cache.find(u => u.id == config.discord.owner_id).send(`:warning: Error fetching custom mention msg: \`\`\`${err}\`\`\``)
                } else {
                    var list = []
                    result.forEach(r=>{
                        list.push(i.id + ' - ' + i.message)
                    })
                    fs.writeFileSync('./data/cache/mention-messages.txt', list.join('\n'))
                    let attachment = new Discord.MessageAttachment('./data/cache/mention-messages.txt')
                    message.author.send('Your messages\nFormat: \`ID - Message\`', attachment)
                }
            })
        }
    }
    if (message.content.toLowerCase().startsWith(`<@${client.user.id}>`) || message.content.toLowerCase().startsWith(`<@!${client.user.id}>`)){
        sql.query("SELECT `message` FROM `mention_responses` WHERE `user` = ?", message.author.id, (err, result)=>{
            if (err){
                console.error(err)
                client.users.cache.find(u => u.id == config.discord.owner_id).send(`:warning: Error fetching custom mention msg: \`\`\`${err}\`\`\``)
            } else {
                var messages = []
                result.forEach(r=>messages.push(r.message))
                message.channel.send(randomItem(messages))
            }
        })
    }
}