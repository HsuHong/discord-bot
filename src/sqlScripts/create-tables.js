module.exports = function(sql, client, config){

    sql.query("CREATE TABLE `twitter_status` (`isOnline` TINYINT(1) PRIMARY KEY DEFAULT 0)" , (err, res) => {
        if (err) console.error(err)
        console.log('[SQL] Created table `twitter_status`')
        sql.query('INSERT INTO `twitter_status` (`isOnline`) VALUES (0)', (err,res)=>{
            if (err) console.error(err)
            console.log('[SQL] `isOnline` has been insered to `twitter_status`, value: 0')
        })
    })
    sql.query("CREATE TABLE `mention_responses` (`user_id` BIGINT PRIMARY KEY NOT NULL, `user_tag` VARCHAR(40) NOT NULL, `reply` JSON NULL);" , (err, res) => {
        if (err) console.error(err)
        console.log('[SQL] Created table `mention_responses`')
    })
}