const express = require('express')

module.exports = function(client, config){
    const app = express()
    const port = 8080 // Port 8080 will be proxied by apache2's module "proxy_http" to its domain

    app.get('/', (req, res)=>{
        res.send(`${client.user.username}\'s dashboard coming later...`)
        res.send(`You can use ${config.discord.prefix}help in the Discord server for more commands!`)
        res.send('')
        res.send('')
        res.send('--- STATUS ---')
        res.send(`${client.user.tag} is online!`)
        res.send(`My user ID is ${client.user.id}`)
    })
    
    app.listen(port, () =>{
        console.log('Express server running')
        client.user.setActivity('bot.arendelleodyssey.com | ' + config.discord.prefix + 'help', { type: 'WATCHING' })
    })
}