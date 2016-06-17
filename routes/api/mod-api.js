var express = require('express');
var router = express.Router();
var Mod = require('../../models/mod-model.js')

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
  {name: 'imgs'}
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



module.exports = router
