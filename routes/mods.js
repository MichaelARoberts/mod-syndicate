var express = require('express');
var router = express.Router();
var Mod = require('../models/mod-model.js')
var User = require('../models/user-model.js')

router.route('/mods')
  .get(function(req,res,next){
    var username = req.session.username
    res.render('./mods/mods', { user:username, title: 'Mod Syndicate | Mods'})
  })

router.route('/mods/:url_id')
  .get(function(req,res){
    var username = req.session.username
    var url_id = req.params.url_id

    Mod.find({url_id:url_id}, function(err,mod){
      if(err){
        res.send(err)
      }
      res.render('./mods/modViewer', {user:username, title:'Mod Syndicate | Mods |' + mod.name})
    })
  })

router.route('/mods/:url_id/edit')
  .get(function(req,res){
    var username = req.session.username
    var url_id = req.params.url_id

    Mod.findOne({url_id:url_id}, function(err,mod){
      if(err){
        res.send(err)
      }

      if(mod.creator != username){
        res.redirect('/mods/' + url_id)
      }

      res.render('./mods/modCreator', {user:username, title:'Mod Syndicate | Mods |' + mod.name})
    })
  })


module.exports = router;
