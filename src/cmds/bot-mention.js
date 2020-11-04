const Discord = require('discord.js')
const fs = require('fs')

function randomItem(array) {
    return array[Math.floor(Math.random() * array.length)];
}

function episode_to_filename(epi) {
    const episode = JSON.parse(fs.readFileSync(episodefile, "utf8"))
    const epi_comp = epi.toUpperCase().replace(/S0/, 'S').replace(/E0/, 'E')
    for (var epNojson in episode) {
        var epNojson_comp = epNojson.toUpperCase().replace(/S0/, 'S').replace(/E0/, 'E')
        if (epi_comp === epNojson_comp) {
            return episode[epNojson];
        }
    }
}

module.exports = function(client, message, prefix, config){
    if (message.content.toLowerCase().startsWith(`<@${client.user.id}>`) || message.content.toLowerCase().startsWith(`<@!${client.user.id}>`)){
        const randommsgs = JSON.parse(fs.readFileSync('./data/bot_mention_reponses.json'))
        for (var authorid in randommsgs) {
            var authorid_comp = authorid
            if (message.author.id === authorid_comp) {
                message.channel.send(randomItem(randommsgs[authorid]))
            }
        }
    }
}