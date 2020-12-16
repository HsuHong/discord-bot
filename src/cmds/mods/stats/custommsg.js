const Discord = require('discord.js')
const Table = require('easy-table')

module.exports = function(message, client, prefix, config, sql){
    sql.query("SELECT DISTINCT user, `command-name`, COUNT(*) AS nbmessages FROM `mention_responses` GROUP BY user ORDER BY NbMessages DESC, `command-name` ASC", function(err, res){
        if (err){
            message.channel.send('An error has been happened. This is reported.')
            client.users.cache.find(u => u.id == config.discord.owner_id).send(`:warning: Error adding custom mention msg: \`\`\`${err}\`\`\``)
        } else {
            var t = new Table
            res.forEach(r=>{
                var username = client.users.cache.get(String(r.user)).username
                if (username == undefined) username = 'Username not found'
                t.cell('User', username)
                t.cell('Messages', r.nbmessages)
                t.newRow()
            })
            t.total('Messages')
            message.channel.send('\`\`\`'+t.toString()+'\`\`\`')
        }
    })
}