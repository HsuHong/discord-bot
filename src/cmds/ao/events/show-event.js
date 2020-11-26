module.exports = function(message, args, command, client, prefix, config, sql){
    sql.query("SELECT TOP 1 * FROM events WHERE date_start < @CurrentDate ORDER BY date_start DESC", (err, res) =>{
        if (err) {
            console.error(err)
            message.channel.send('Error :/\n' + err)
        }
        console.log(res)
    })
}