module.exports = function(app, client, config, sql){
    app.use('/', require('./routes/index.js')(client, config));
    app.use('/status', require('./routes/status.js')(client, config, sql));
    app.use('/events', require('./routes/events.js')(client, config, sql));
}