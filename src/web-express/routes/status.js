var express = require('express');
const os = require('os');
const fs = require('fs');
const shell = require('shelljs')
const package = JSON.parse(fs.readFileSync('./package.json', "utf8"));


module.exports = function(client, config, sql){
  var router = express.Router();
  
  router.get('/', async function(req, res, next) {
    var discordjsver = shell.exec('npm view discord.js version', {silent:true}).stdout.replace('\n','')
    if (!discordjsver) var discordjsver = 'not found'
    var nodever = shell.exec('node -v', {silent:true}).stdout.replace('v','').replace('\n','')
    if (!nodever) var nodever = 'not found'

    var twitter_status = undefined
    await sql.query("SELECT `isOnline` FROM `twitter_status`", (err, result)=>{
      if (err){
        console.error(err)
        twitter_status = 'Unknown'
      } else {
        if (result[0].isOnline == 0) twitter_status = "Inactive"
        else twitter_status = "Active"
      }

      res.render('status', {
        client: client,
        twitter_status: twitter_status,
        discordjsver: discordjsver,
        nodever: nodever,
        config: config
      })
    })
  });

  return router
}
