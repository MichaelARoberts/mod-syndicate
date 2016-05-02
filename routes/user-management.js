var express = require('express');
var router = express.Router();
var User = require('../models/user-model.js')

router.route('/login')
  .get(function(req,res,next){
    res.render('login', { title: 'Mod Syndicate | Log In'})
  })

router.route('/signup')
  .get(function(req,res,next){
    res.render('signup', { title: 'Mod Syndicate | Sign UP'})
  })

module.exports = router;
