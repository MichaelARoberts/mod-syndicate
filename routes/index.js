var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  var username = req.session.username
  res.render('index', { title: 'Mod Syndicate', user:username});
});

module.exports = router;
