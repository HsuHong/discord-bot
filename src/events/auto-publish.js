const Discord = require('discord.js')
const fetch = require('node-fetch');

module.exports = async function(client, message, config){
	if (message.channel.id == '729985657656836096') return // Don't do this in announcements channel (we'll do it manually)
	var token
	if (client.user.id == config.discord.bot_id){
        token = config.discord.token
    } else if (client.user.id == config.discord.bot_id_beta) {
        token = config.discord.token_beta
    }
    const { options: { http }, rest } = client;
    if (message.channel.type === 'news') {
		const url = `${http.api}/v${http.version}/channels/${message.channel.id}/messages/${message.id}/crosspost`
		console.log(url)
		await fetch(url,
			{
				method: 'POST',
				headers: {
					'Authorization': `${rest.tokenPrefix} ${token}`,
				},
			},
		)
	}
}
