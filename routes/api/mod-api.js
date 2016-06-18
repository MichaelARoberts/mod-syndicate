var express = require('express');
var router = express.Router();
var Mod = require('../../models/mod-model.js')
var marked = require('marked')

var crypto = require('crypto')
var mime = require('mime')

// Multer Stuff
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

var modUpload = upload.fields([
  {name: 'imgs'},
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
      url_id : req.body.url_id,
      creator: req.session.username
    })

    newMod.save(function(err){
      if(err){
        res.send(err)
      } else {
        res.send({success:true})
      }
    })


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
    if(req.files.img === undefined || req.files.img === null){
      Mod.update({url_id:req.params.id},{
        name: req.body.name,
        desc: req.body.desc,
        html_desc : marked(req.body.desc),
        creator: req.session.username,
        file_loc: req.files.mod_file[0]['filename'],
        updated_date : Date.now(),
      }, function(err,list){
        if(err){
          res.send(err)
        }
      })
    }

    if(req.files.mod_file === undefined || req.files.mod_file === null){

      var imageLocations = []

      for(var image of req.files.imgs) {
        imageLocations.push(image['filename'])
      }

      Mod.update({url_id:req.params.id},{
        name: req.body.name,
        desc: req.body.desc,
        html_desc : marked(req.body.desc),
        creator: req.session.username,
        images_loc: imageLocations,
        updated_date : Date.now(),
      }, function(err,list){
        if(err){
          res.send(err)
        }
      })
    }

    else{
      var imageLocations = []

      for(var image of req.files.imgs) {
        imageLocations.push(image['filename'])
      }

      Mod.update({url_id:req.params.id},{
        name: req.body.name,
        desc: req.body.desc,
        html_desc : marked(req.body.desc),
        creator: req.session.username,
        file_loc: req.files.mod_file[0]['filename'],
        images_loc: imageLocations,
        updated_date : Date.now(),
      }, function(err,list){
        if(err){
          res.send(err)
        }
      })
    }

  })
module.exports = router
