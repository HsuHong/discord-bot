const Discord = require('discord.js')
const fetch = require('node-fetch');

module.exports = async function(client, message, config){
    const { options: { http }, rest } = client;
    if (message.channel.type === 'news') {
		await fetch(`${http.host}/api/v${http.version}/channels/${message.channel.id}/messages/${message.id}/crosspost`,
			{
				method: 'POST',
				headers: {
					'Authorization': `Bot ${config.discord.token}`,
				},
			},
		)
	}
}
