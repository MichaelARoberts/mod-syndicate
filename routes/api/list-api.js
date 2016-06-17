var express = require('express');
var router = express.Router();
var List = require('../../models/list-model.js')

var crypto = require('crypto')
var mime = require('mime')

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
  {name: 'img'}
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
      desc : req.body.desc,
      url_id : req.body.url_id,
      creator : req.session.username
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

    if(req.files.img === undefined || req.files.img === null){
      List.update({url_id: req.params.id}, {
        name : req.body.name,
        mods : req.body.mods,
        game : req.body.game,
        desc : req.body.desc,
        updated_date: Date.now(),
        creator: req.session.username,
      },function(err,list) {
        if (err){
          res.send(err);
        }
      })
    } else {
      List.update({url_id: req.params.id}, {
        name : req.body.name,
        mods : req.body.mods,
        game : req.body.game,
        desc : req.body.desc,
        creator: req.session.username,
        updated_date: Date.now(),
        image_loc: req.files.img[0]['filename']
      },function(err,list) {
        if (err){
          res.send(err);
        }
      })
    }
  })

module.exports = router;
