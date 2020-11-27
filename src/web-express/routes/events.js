var express = require('express');
const os = require('os');
const fs = require('fs');

module.exports = function(client, config, sql){
  var router = express.Router();
  router.get('/', async function(req, res, next) {
    await sql.query("SELECT * FROM events ORDER BY date_start DESC", (err, sqlres) => {
      if (err) {
        console.error(err)
      } else {
        res.render('eventList', {
          client: client,
          config: config,
          sqlresults: sqlres
        })
      }
    })
  })
  return router
}
