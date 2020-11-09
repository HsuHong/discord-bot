var express = require('express');

module.exports = function(client, config){
  var router = express.Router();

  /* GET home page. */
  router.get('/', function(req, res, next) {
    res.render('index', { title: client.user.username });
  });

  return router
}
