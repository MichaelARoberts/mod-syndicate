var express = require('express');
var router = express.Router();
var List = require('../../models/list-model.js')

var multer = require('multer');
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/imgs')
  },
  filename: function (req, file, cb) {
    crypto.pseudoRandomBytes(16, function (err, raw) {
      cb(null, raw.toString('hex') + Date.now() + '.' + mime.extension(file.mimetype));
    });
  }
});

var upload = multer({
  dest:'./public/imgs',
  storage:storage
})

var listUpload = upload.fields([
  {name:'name'},
  {name:'mods'},
  {name:'url_id'},
])

router.route('/lists')

  .get(function(req, res, next) {
    List.find(function(err, lists) {
      if (err){
        res.send(err)
      }
      res.json(lists)
    })
  })

  .post(listUpload, function(req,res,next) {
    newList = new List({
      name : req.body.name,
      mods : req.body.mods,
      url_id : req.body.url_id,
      creator : "Default"
    })

    newList.save(function(err){
      if (err){
        res.send(err)
      } else {
        res.send({success:true})
      }
    })

  })

router.route('/lists/:id')

  .get(function(req, res, next) {
    List.findOne({url_id: req.params.id}, function(err, list) {
      if (err)
          res.send(err);

      res.json(list);
    })
  })

  .put(listUpload, function(req, res, next) {
    List.update({url_id: req.params.id}, {
      name : req.body.name,
      mods : req.body.mods
    },function(err, affected, list) {
      if (err)
          res.send(err);
    })
  })

module.exports = router;
