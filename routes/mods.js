var express = require('express');
var router = express.Router();
var Mod = require('../models/mod-model.js')

router.route('/mods')
  .get(function(req,res,next){
    var username = req.session.username
    res.render('./mods/mods', { title: 'Mod Syndicate | Mods'})
  })

router.route('/mods/:url_id')
  .get(function(req,res){
    var username = req.session.username
    var url_id = req.params.url_id

    Mod.findOne({url_id: url_id}, function(err, mod){
      if(err){
        res.send(err)
      }

      if(username == null || username == undefined){
        res.render('./lists/listViewer', {user:username, title:'Mod Syndicate | Mod | ' + mod.name})
      } else {
        res.render('./lists/listCreator', {user:username, title:'Mod Syndicate | Mod Creator | ' + mod.name})
      }
    })
  })

module.exports = router;
