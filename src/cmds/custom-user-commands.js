const Discord = require('discord.js')

function randomItem(array) {
    return array[Math.floor(Math.random() * array.length)];
}

module.exports = function(client, message, prefix, config, sql){
    sql.query("SELECT DISTINCT `command-name` FROM `mention_responses`", (err, result)=>{
        if (err) return

        result.forEach(r=>{
            var command = r['command-name']
            console.log(command)
            if (message.content.toLowerCase() == prefix + command.toLowerCase()){
                sql.query("SELECT `message` FROM `mention_responses` WHERE `command-name` = ?", command, (err, result)=>{
                    if (err){
                        console.error(err)
                        client.users.cache.find(u => u.id == config.discord.owner_id).send(`:warning: Error fetching custom mention msg: \`\`\`${err}\`\`\``)
                    } else {
                        var messages = []
                        result.forEach(r=>messages.push(r.message))
                        if (messages.length < 1) return
                        message.channel.send(randomItem(messages))
                    }
                })
            }
        })
    })
}