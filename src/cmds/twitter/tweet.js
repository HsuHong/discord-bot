const Discord = require('discord.js')
const Twitter = require('twit')
const download = require('download')
const fs = require('fs')

module.exports = async function(client, message, prefix, config){
    if (message.content.toLowerCase().startsWith(prefix + 'tweet')){
        if (config.twitter.posters.includes(message.author.id)){

            const twitter_tokens = {
                consumer_key:        config.twitter.consumer_key,
                consumer_secret:     config.twitter.consumer_secret,
                access_token:        config.twitter.access_token_key,
                access_token_key:    config.twitter.access_token_key,
                access_token_secret: config.twitter.access_token_secret
            };
            const twitter = new Twitter(twitter_tokens)

            let args = message.content.split(" ");
            args.shift();
            if (args.length < 1) return message.channel.send(`Usage: \`${prefix}tweet [message]\`. You can add an image attached with the command`)
            var text = args.join(' ')
            
            if (text.length >= 280){
                message.channel.send('Your message exceeds Twitter\'s limit who is 280 characters.\nPlease use the web/mobile app')
            } else {
                if (message.attachments.size > 0){

                    download(message.attachments.array()[0].url, './data', {filename: 'img' + message.attachments.array()[0].url.slice(-4)})
                    .then(function(){
                        // Load your image
                        var data = fs.readFileSync('./data/img'+ message.attachments.array()[0].url.slice(-4), { encoding: 'base64' });

                        // Make post request on media endpoint. Pass file data as media parameter
                        twitter.post('media/upload', {media_data: data}, function(error, media, response) {
                            if (!error) {
                                // Lets tweet it
                                var status = {
                                    status: text,
                                    media_ids: media.media_id_string // Pass the media id string
                                }

                                twitter.post('statuses/update', status, function(error, tweet, response) {
                                    if (!error) {
                                        message.channel.send(`https://twitter.com/${tweet.user.screen_name}/status/${tweet.id_str}`)
                                        fs.unlinkSync('./data/img'+ message.attachments.array()[0].url.slice(-4))
                                    } else {
                                        console.error(error)
                                        message.channel.send('Error while tweeting')
                                    }
                                });
                            } else if (error) {
                                console.error(error)
                                message.channel.send('Error while uploading to Twitter')
                            }
                        })
                    })
                    .catch(err=>{
                        console.error(err)
                        message.channel.send('Error while uploading the image to Twitter')
                    })
                } else {
                    twitter.post('statuses/update', {status: text}, function(error, tweet, response) {
                        if (!error) {
                            message.channel.send(`https://twitter.com/${tweet.user.screen_name}/status/${tweet.id_str}`)
                        } else {
                            message.channel.send('Error while tweeting')
                            console.error(error)
                        }
                    });
                }
            }
        } else {
            message.react('<:ao6:764125409909669919>')
        }
    }
}