const Discord = require('discord.js')

module.exports = function(client, message, prefix, config){

    // Twitter integration
    require('./twitter/tweet.js')(client, message, prefix, config)

}