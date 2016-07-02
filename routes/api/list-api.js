var express = require('express');
var router = express.Router();
var List = require('../../models/list-model.js')
var marked = require('marked')

var crypto = require('crypto')
var mime = require('mime')
var multerS3 = require('multer-s3')
var aws = require('aws-sdk')
aws.config.update({
  accessKeyId: 'AKIAJUT2543SO3THLRQQ',
  secretAccessKey : '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',
  region: 'us-west-1'
})

// Multer Stuff
var multer = require('multer');

// Amazon S3
var s3 = new aws.S3({
  params: {
    Bucket: 'mod-syndicate'
  }
})


var upload = multer({
  storage: multerS3({
    s3:s3,
    bucket: 'mod-syndicate',
    acl: 'public-read',
    metadata: function(req,file,cb){
      cb(null, {fieldName: file.fieldname})
    },
    key: function(req,file,cb){
      cb(null, Date.now().toString() + '.' + mime.extension(file.mimetype))
    }
  })
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
      html_desc : marked(req.body.desc || ''),
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
        html_desc : marked(req.body.desc.toString() || ''),
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
        html_desc : marked(req.body.desc.toString() || ''),
        creator: req.session.username,
        updated_date: Date.now(),
        image_loc: req.files.img[0]['location']
      },function(err,list) {
        if (err){
          res.send(err);
        }
      })
    }
  })

module.exports = router;
