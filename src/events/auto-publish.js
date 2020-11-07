const Discord = require('discord.js')
const fetch = require('node-fetch');

module.exports = async function(client, message, config){
    const { options: { http }, rest } = client;
    if (message.channel.type === 'news') {
		const url = `${http.api}/v${http.version}/channels/${message.channel.id}/messages/${message.id}/crosspost`
		console.log(url)
		await fetch(url,
			{
				method: 'POST',
				headers: {
					'Authorization': `${rest.tokenPrefix} ${config.discord.token}`,
				},
			},
		)
	}
}
