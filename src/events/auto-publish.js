const Discord = require('discord.js')
const fetch = require('node-fetch');

module.exports = function(client, message, config){
    const { options: { http }, rest } = client;
    if (message.channel.type === 'news') {
		await fetch(`${http.api}/v${http.version}/channels/${message.channel.id}/messages/${message.id}/crosspost`,
			{
				method: 'POST',
				headers: {
					'Authorization': `${rest.tokenPrefix} ${config.discord.token}`,
				},
			},
		)
	}
}