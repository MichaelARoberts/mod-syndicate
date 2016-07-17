var express = require('express');
var router = express.Router();
var Mod = require('../../models/mod-model.js')
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

var modUpload = upload.fields([
  {name: 'images_loc'},
  {name: 'mod_file'}
])


router.route('/mods')

  .get(function(req,res,next){
    Mod.find(function(err,mods){
      if(err){
        res.send(err)
      }
      res.json(mods)
    })
  })

  .post(modUpload, function(req,res,next){

    newMod = new Mod({
      name : req.body.name,
      mods : req.body.mods,
      desc : req.body.desc,
      views : 0,
      url_id : req.body.url_id,
      game: req.body.game,
      creator: req.session.username,
      isPrivate : false
    })

    User.findOne({username: req.session.username}, function(err,user){
      if(err){
        res.send(err)
      } else {
        user.created_mods.push(req.body.url_id)

        user.save(function(err){
          if(err){
            res.send(err)
          }
        })
      }
    })

    newMod.save(function(err){
      if(err){
        res.send(err)
      }
    })

    res.send({success:true})

  })


router.route('/mods/:id')

  .get(function(req,res,next){
    Mod.findOne({url_id: req.params.id}, function(err,mod){
      if(err) {
        res.send(err)
      }
      res.json(mod)
    })
  })

  .put(modUpload, function(req,res,next){

    var mod_file
    var images_loc

    if(req.files.mod_file === null || req.files.mod_file === undefined){
      mod_file = ''
    } else {
      mod_file = req.files.mod_file[0]['location']
    }

    if(req.files.images_loc === null || req.files.images_loc === undefined){
      images_loc = ''
    } else {
      images_loc = req.files.images_loc[0]['location']
    }

    console.log(req.body.isPrivate)

    Mod.findOneAndUpdate({url_id:req.params.id},{
      name: req.body.name,
      desc: req.body.desc,
      game: req.body.game,
      html_desc : marked(req.body.desc.toString() || ''),
      creator: req.session.username,
      mod_file:  mod_file, // Check if null or undefined
      images_loc : images_loc, // Check if null or undefined
      updated_date : Date.now(),
      isPrivate : req.body.isPrivate
    }, {upsert:true}, function(err,list){
      if(err){
        res.send(err)
      }
    })

    res.json({success:true})
  })

module.exports = router
