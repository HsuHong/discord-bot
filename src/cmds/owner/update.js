const Discord = require('discord.js');
const shell = require('shelljs');

module.exports = function(message, client, prefix) {
    if (message.content.startsWith(prefix + 'update')) {
        try {
            message.channel.startTyping()
            shell.exec('git pull && sudo npm update && pm2 reload ecosystem.config.js', {silent:false}, function(code, stdout, stderr) {
                message.reply(`Output:\n\`\`\`${stdout}${stderr}\`\`\``).then(m=>message.channel.stopTyping(true));
            });
        } catch (err) {
            message.reply(`EVAL **__ERROR__**`);
            message.channel.stopTyping(true)
        }
    }
}