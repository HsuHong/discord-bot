var express = require('express');
const os = require('os');
const fs = require('fs');


module.exports = function(client, config, sql){
  var router = express.Router();
  
  router.get('/', async function(req, res, next) {
    res.render('eventList', {
      client: client,
      config: config,
      sql: sql
    })
  })
  return router
}
