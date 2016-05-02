var express = require('express');
var router = express.Router();
var List = require('../models/list-model.js')

/* GET home page. */
router.route('/lists')
  .get(function(req, res, next) {
    res.render('lists', { title: 'Mod Syndicate | Lists' });
  })

router.route('/lists/:id')
  .get(function(req, res, next) {
    res.render('listCreator', { title: 'Mod Syndicate | List Creator' });
  })

module.exports = router;
