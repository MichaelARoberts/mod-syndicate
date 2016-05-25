var express = require('express');
var router = express.Router();
var List = require('../models/list-model.js')

/* GET home page. */
router.route('/lists')
  .get(function(req, res, next) {
    var username = req.session.username
    res.render('lists', { title: 'Mod Syndicate | Lists', user:username });
  })

router.route('/lists/:id')
  .get(function(req, res, next) {
    var username = req.session.username
    res.render('listCreator', { title: 'Mod Syndicate | List Creator', user:username});
  })

module.exports = router;
