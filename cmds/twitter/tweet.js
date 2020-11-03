const Discord = require('discord.js')
const Twitter = require('twitter-lite')
const download = require('download')
const fs = require('fs')

module.exports = async function(client, message, prefix, config, twitter_client){
    if (message.content.toLowerCase().startsWith(prefix + 'tweet')){
        if (config.twitter.posters.includes(message.author.id)){
            let args = message.content.split(" ");
            args.shift();
            args.join(' ')
            
            if (args.length >= 280){
                message.channel.send('Your message exceeds Twitter\'s limit who is 280 characters.\nPlease use the web/mobile app')
            } else {
                var tweet;

                if (message.attachments.size > 0){

                    download(message.attachments.array()[0].url, './data', {filename: 'img' + message.attachments.array()[0].url.slice(-4)})
                    .then(async function(){
                        // Load your image
                        var data = fs.readFileSync('./data/img' + message.attachments.array()[0].url.slice(-4));

                        // Make post request on media endpoint. Pass file data as media parameter
                        twitter_client.post('media/upload', {media: data}, function(error, media, response) {
                            if (!error) {
                                // Lets tweet it
                                var status = {
                                    status: args,
                                    media_ids: media.media_id_string // Pass the media id string
                                }

                                tweet = await twitter_client.post('statuses/update', status, function(error, tweet, response) {
                                    if (error) {
                                        message.channel.send('Error while tweeting')
                                    }
                                    fs.unlinkSync('./data/img' + message.attachments.array()[0].url.slice(-4))
                                });
                            } else if (error) {
                                message.channel.send('Error while uploading the image to Twitter')
                            }
                        });
                    })                    
                } else {
                    tweet = await twitter_client.post("statuses/update", {
                        status: args
                    });
                }
                message.channel.send(`https://twitter.com/${tweet.user.screen_name}/status/${tweet.id_str}`)
            }
        } else {
            message.react('<:ao6:764125409909669919>')
        }
    }
}