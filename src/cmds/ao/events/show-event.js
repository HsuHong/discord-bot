module.exports = function(message, args, command, client, prefix, config, sql){
    sql.query("SELECT * FROM events ORDER BY date_start DESC LIMIT 1", (err, res) =>{
        if (err) {
            console.error(err)
            message.channel.send('Error :/\n' + err)
        }
        console.log(res)
    })
}