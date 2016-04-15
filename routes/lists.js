var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/lists', function(req, res, next) {
  res.render('listCreator', { title: 'List Creator' });
});

router.get('/list-creator', function(req,res,next){
  res.render('listCreator', { title: 'List Creator' });
})

module.exports = router;
