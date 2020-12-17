const path = require('path');
const createError = require('http-errors');
var scriptName = path.basename(__filename).replace('.js', '');

module.exports = function(app, client, config, sql){
    app.get('/'+scriptName, async (req, res, next) => {
        try{
            res.json(client.guilds.cache.get('662011227639250972').members.cache)
        } catch (err){
            console.error(err)
            next(createError(500))
        }
    })

    app.get('/'+scriptName+'/:uid', async (req, res, next) => {
        try{
            var r = await client.guilds.cache.get('662011227639250972').members.fetch(req.params.uid)
            var u = await client.users.fetch(req.params.uid)
            res.json({member: r, user: u})
        } catch (err){
            console.error(err)
            if (err.code == "GUILD_MEMBERS_TIMEOUT") next(createError(504))
            else next(createError(500))
        }
    })
}