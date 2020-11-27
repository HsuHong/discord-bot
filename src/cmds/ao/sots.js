const Discord = require('discord.js');

module.exports = function(message, client, prefix, config) {
    if (message.content.startsWith(prefix + 'sots')) {
        try {

            var countDownDate = new Date("Nov 27, 2020 17:00:00 GMT").getTime();
            var countdown;
            var now = new Date().getTime();

            var distance = countDownDate - now;

            var days = Math.floor(distance / (1000 * 60 * 60 * 24));
            var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            var seconds = Math.floor((distance % (1000 * 60)) / 1000);

            countdown = hours + " hours, " + minutes + " minutes, " + seconds + " seconds";

            if (distance < 0) countdown = "[Watch Now!](https://www.youtube.com/watch?v=jnJhpID2JrQ)";

            let embed = new Discord.MessageEmbed();
            embed.setAuthor('Spirit of Two Sisters', client.user.displayAvatarURL(), 'https://arendelleodyssey.com/spirit-of-two-sisters')
            .setDescription('__Spirit of Two Sisters__ is a breathtaking video edit collab that\'ll take you on a journey around the world of Frozen, retelling the events of both movies in a new, exciting way. Set to release on the anniversary of Frozen 1, November 27th, it was made in collaboration with eight video editors to commemorate this beautiful franchise that changed our lives forever.')
            .setImage('https://cdn.discordapp.com/attachments/729985657656836096/780474928762716171/banner.png')
            .addField('Countdown:', countdown)
            .addField('Trailer:', '[Click me](https://youtu.be/JPluSHozZvQ)')
            message.channel.send(embed)
        } catch (err) {
            message.channel.send('Uh uh... I am lost (maybe in the woods)')
            console.error(err)
        }
    }
}