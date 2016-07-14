var express = require('express');
var router = express.Router();
var List = require('../../models/list-model.js')
var User = require('../../models/user-model.js')
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

    User.findOne({username: req.session.username}, function(err,user){
      if(err){
        res.send(err)
      } else {
        user.created_lists.push(req.body.url_id)

        user.save(function(err){
          if(err){
            res.send(err)
          }
        })
      }
    })

    newList.save(function(err){
      if (err){
        res.send(err)
      }
    })

    res.json({success:true})


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
    List.findOne({url_id:req.params.id}, function(err,list){
      if(err){
        res.send(err)
      }

      for(var key of Object.keys(req.body)){
        list[key] = req.body[key]
      }

      if(req.body.desc !== null || req.body.desc !== undefined){
        list.html_desc = marked(req.body.desc.toString() || '')
      }

      if (req.files.img === undefined || req.files.img === null){
        list.image_loc = ""
      } else {
        list.image_loc = req.files.img[0]['location']
      }

      list.updated_date = Date.now()
      list.creator = req.session.username

      list.save(function(err){
        if(err){
          res.send(err)
        } else {
          res.json(list)
        }
      })
    })
  })

module.exports = router;
