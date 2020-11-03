const Discord = require('discord.js')

module.exports = function(client, message, prefix, config, twitter_client){

    // Twitter integration
    require('./twitter/tweet.js')(client, message, prefix, config, twitter_client)

}