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

module.exports = router;
