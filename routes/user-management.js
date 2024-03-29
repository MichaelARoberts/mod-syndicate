var express = require('express');
var router = express.Router();
var User = require('../models/user-model.js')


router.route('/login')
  .get(function(req,res,next){
    var username = req.session.username
    res.render('./user/login', { title: 'Mod Syndicate | Log In', user:username})
  })

router.route('/signup')
  .get(function(req,res,next){
    var username = req.session.username
    res.render('./user/signup', { title: 'Mod Syndicate | Sign Up', user:username})
  })

router.route('/logout')
  .get(function(req,res,next){
    req.session.username = null;
    var username = req.session.username
    res.redirect('/')
  })

router.route('/user-settings')
  .get(function(req,res,next){
    var username = req.session.username
    res.redirect('/users/' + username)
  })

router.route('/users/:username')
  .get(function(req,res,next){
    var loggedInUser = req.session.username
    var username = req.params.username

    if(username == loggedInUser){
      res.render('./user/profileCreator', { title: 'Mod Syndicate | User | ' + username, user:loggedInUser})
    } else {
      res.render('./user/profileViewer', { title: 'Mod Syndicate | User | ' + username, user:loggedInUser})
    }
  })

router.route('/me')
  .get(function(req,res,next){
    var loggedInUser = req.session.username
    var username = req.params.username

    if(username == loggedInUser){
      res.render('./user/profileCreator', { title: 'Mod Syndicate | User | ' + username, user:loggedInUser})
    } else {
      res.render('./user/profileViewer', { title: 'Mod Syndicate | User | ' + username, user:loggedInUser})
    }
  })
module.exports = router;
