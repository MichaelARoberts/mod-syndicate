var express = require('express');
var router = express.Router();
var List = require('../models/list-model.js')

/* GET home page. */
router.route('/lists')
  .get(function(req, res, next) {
    var username = req.session.username
    res.render('./lists/lists', { title: 'Mod Syndicate | Lists', user:username });
  })

router.route('/lists/:url_id')
  .get(function(req, res) {
    var username = req.session.username
    var url_id = req.params.url_id

    List.findOne({url_id: url_id}, function(err, list) {
      if (err){
        res.send(err)
      }

      if(username === null || username === undefined || username !== list.creator){
        res.render('./lists/listViewer', {user:username, title:'Mod Syndicate | List | ' + list.name})
      } else {
        res.render('./lists/listCreator', {user:username, title:'Mod Syndicate | List Creator | ' + list.name})
      }
    })

  })

module.exports = router;
