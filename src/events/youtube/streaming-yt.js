const Discord = require('discord.js')
const youtube = require('youtube-api')

function getLatestDate(data) {
    // convert to timestamp and sort
    var sorted_ms = data.map(function(item) {
       return new Date(item.MeasureDate).getTime()
    }).sort(); 
    // take latest
    var latest_ms = sorted_ms[sorted_ms.length-1];
    // convert to js date object 
    return latest_ms;
}

module.exports = function(client, config, old_yt_id){
    try{

        youtube.authenticate({
            type: 'key',
            key: config.youtube.apikey,
        });

        setInterval(function(){
            youtube.search.list({
                type: 'video',
                part: 'snippet',
                pageToken: null,
                maxResults: 50,
                channelId: config.youtube.channelID,
            }, function(err, data) {
                if (err) return function(){
                    console.error('Youtube Fetch error: ' + err);
                    // client.users.cache.find(u => u.id == config.discord.owner_id).send(`:warning: Error on youtube streaming api: \`\`\`${err}\`\`\``)
                }
                var channelItems = []
            
                for (var x in data.data.items) {
                    channelItems.push(data.data.items[x]);
                }
            
                var timestamps = []
                channelItems.forEach(i=>{
                    timestamps.push({MeasureDate: i.snippet.publishedAt})
                })
                var lastVid_timestamp = getLatestDate(timestamps)
                channelItems.forEach(async i=>{
                    if (new Date(i.snippet.publishedAt).getTime() == lastVid_timestamp){
                        if (old_yt_id != undefined && old_yt_id === i.id.videoId) {
                            console.log('[YT] no new posts')
                        }
                        if (old_yt_id != undefined && old_ig_id !== i.id.videoId){
                            console.log('[YT] new post!')
    
                            var webhooks = await client.channels.find(c => c.id == config.youtube.post_channel_id).fetchWebhooks()
                            var webhook = webhooks.find(wh=> wh.name == 'AO Youtube')
                            if (webhook == null){
                                await client.channels.find(c => c.id == config.youtube.post_channel_id).createWebhook('AO Youtube', 'https://cdn.discordapp.com/attachments/662735703284908067/785229698732654612/Screen_Shot_2020-07-13_at_10.png')
                                webhook = webhooks.find(wh=> wh.name == 'AO Youtube')
                                if (webhook == null) return
                            }
        
                            let embed = new Discord.MessageEmbed
                            embed   .setColor(config.youtube.embed_color)
                                    .setAuthor('New video!', client.user.displayAvatarURL(), `https://www.youtube.com/watch?v=${i.id.videoId}`)
                                    .setDescription(`[**${i.snippet.title}**](https://www.youtube.com/watch?v=${i.id.videoId})\n\n${i.snippet.description}`)
                                    .setImage(i.snippet.thumbnails.high.url)
        
                            webhook.send(`https://www.youtube.com/watch?v=${i.id.videoId}`, {
                                username: i.snippet.channelTitle,
                                avatarURL: 'https://cdn.discordapp.com/attachments/662735703284908067/785229698732654612/Screen_Shot_2020-07-13_at_10.png',
                                embeds: [embed]
                            })
                            old_yt_id = i.id.videoId
                        }
                        if (old_yt_id == undefined) {
                            console.log('[YT] var not defined')
                            old_yt_id = i.id.videoId
                        }
                    }
                })
            });
        }, config.youtube.check_time * 1000)
    } catch (err) {
        console.error(err)
        client.users.cache.find(u => u.id == config.discord.owner_id).send(`:warning: Error on youtube streaming api: \`\`\`${err}\`\`\``)
    }
}