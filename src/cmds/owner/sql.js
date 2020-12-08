const Discord = require("discord.js");
const fs = require('fs');
const { MessageAttachment } = require('discord.js');

 function clean(text) {
    if (typeof(text) === "string")
        return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
    else
        return text;
}

module.exports = function(message, client, prefix, sql) {
    if (message.content.startsWith(prefix + "sql")) {
        try {
            const args = message.content.split(" ").slice(1);
            if (args.length < 1) return message.react('❌');

            sql.query(args.join(' '), function(err,data){

                if (err.length > 1024 && err.length < 1950 || data.length > 1024 && data.length < 1950) return message.reply(`Output:\n\`\`\`${err}${data}\`\`\``);
            
                if (err.length > 1950 || data.length > 1950) return fs.writeFile('./data/cache/sql.log', `Command: ${args.join(' ')}\n\n\nOutput:\n\n${err}${data}`, 'utf8', (err) => {
                    if (err) return function(){
                        console.log(err);
                        message.reply(`FS error: ${err}`)
                    }
                    const attachment = new MessageAttachment('./data/cache/sql.log')
                    message.reply('Output is more than 2000 characters, see attachment', attachment)
                })

                message.reply(`SQL:\n\`\`\`sql\n${args.join(' ')}\`\`\`\nResult: \`${err}${data}\``);
            })  
        } catch (err) {
            const args = message.content.split(" ").slice(1);
            message.reply(`SQL **__ERROR__**\n\`\`\`javascript\n${args.join(" ")}\`\`\`\nNode Result: \`${clean(err)}\``);
        }
    }
}