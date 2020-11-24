const Discord = require('discord.js');

module.exports = function(message, client, prefix, config) {
    if (message.content.startsWith(prefix + 'sots')) {
        try {
            let embed = new Discord.MessageEmbed();
            embed.setAuthor('Spirit of Two Sisters', client.user.displayAvatarURL())
            .setDescription('Presenting Spirit of Two Sisters, a breathtaking video edit collab that\'ll take you on a journey around the world of Frozen, retelling the events of both movies in a new, exciting way. Set to release on the anniversary of Frozen 1, November 27th, it was made in collaboration with eight video editors to commemorate this beautiful franchise that changed our lives forever.')
            .setImage('https://cdn.discordapp.com/attachments/729985657656836096/780474928762716171/banner.png')
            message.channel.send(embed)
        } catch (err) {
            message.channel.send('Uh uh... I am lost (maybe in the woods)')
            console.error(err)
        }
    }
}