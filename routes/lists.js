var express = require('express');
var router = express.Router();
var List = require('../models/list-model.js')

/* GET home page. */
router.route('/lists')
  .get(function(req, res, next) {
    var username = req.session.username
    res.render('lists/lists', { title: 'Mod Syndicate | Lists', user:username });
  })

router.route('/lists/:id')
  .get(function(req, res, next) {
    var username = req.session.username

    List.findOne({url_id: req.params.id}, function(err, list) {
      if (err){
        res.send(err);
      }

      if (list.creator == username){
        res.render('lists/listCreator', { title: 'Mod Syndicate | List Creator', user:username});
      } else {
        res.render('lists/listViewer', { title: 'Mod Syndicate | ' + list.name,
          user:username,
          name:list.name
        })
      }
    })
  })

module.exports = router;
