const Discord = require('discord.js')

module.exports = function(client, message, prefix, config){

    require('./help.js')(client, message, prefix, config)

    // Twitter integration
    require('./twitter/tweet.js')(client, message, prefix, config)

    // Owner commands
    if (message.author.id == config.discord.owner_id){
        require('./owner/update.js')(message, client, prefix)
    }

}