var express = require('express');
const os = require('os');
const fs = require('fs');
const shell = require('shelljs')
const package = JSON.parse(fs.readFileSync('./package.json', "utf8"));


module.exports = function(client, config){
  var router = express.Router();

  var discordjsver = shell.exec('npm view discord.js version', {silent:true}).stdout.replace('\n','')
  if (!discordjsver) var discordjsver = 'not found'
  var nodever = shell.exec('node -v', {silent:true}).stdout.replace('v','').replace('\n','')
  if (!nodever) var nodever = 'not found'
  
  router.get('/', function(req, res, next) {
    res.render('status', {
      client: client,
      discordjsver: discordjsver,
      nodever: nodever,
      config: config
    })
  });

  return router
}
