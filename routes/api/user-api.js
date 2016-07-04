var express = require('express')
var router = express.Router()
var User = require('../../models/user-model.js')
var multer = require('multer')
var jwt = require('jsonwebtoken');

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/imgs')
  },
  filename: function (req, file, cb) {
    crypto.pseudoRandomBytes(16, function (err, raw) {
      cb(null, raw.toString('hex') + Date.now() + '.' + mime.extension(file.mimetype));
    });
  }
})

var upload = multer({
  dest: './public/imgs',
  storage:storage
})

var userUpload = upload.fields([
  {name: 'profile_pic_location'}
])


router.route('/users')

  .get(function(req,res,next){
    User.find(function(err,users){
      if(err){
        res.send(err)
      }

      res.json(users)
    })
  })

  .post(userUpload, function(req,res,next){
    var username = req.body.username

    newUser = new User({
      username: req.body.username,
      password: req.body.password,
      email: req.body.email,
      fname: req.body.fname,
      lname: req.body.lname,
      age: req.body.age
    })

    newUser.save(function(err){
      if(err){
        res.send(err)
      } else {
        res.send({success:true})
      }
    })
  })

router.route('/users/:username')

  .get(function(req,res,next){
    User.findOne({username : req.params.username}, function(err, user){
      if(err){
        res.send(err)
      }
      res.json(user)
    })
  })


  .put(userUpload,function(req,res,next){
    if(req.files.profile_pic_location === undefined || req.files.profile_pic_location === null){
      User.update({username:req.params.username},{
        fname: req.body.fname,
        lname: req.body.lname,
        email: req.body.email,
        bio: req.body.bio,
        twitter_link: req.body.twitter_link,
        facebook_link: req.body.facebook_link,
      }, function(err, user){
        if(err){
          res.send(err)
        }

        res.json({success:true})
      })

    } else {
      User.update({url_id:req.params.username},{
        fname: req.body.fname,
        lname: req.body.lname,
        email: req.body.email,
        profile_pic_location: req.files.profile_pic_loc[0]['filename'],
        bio: req.body.bio,
        twitter_link: req.body.twitter_link,
        facebook_link: req.body.facebook_link,
      }, function(err, user){
        if(err){
          res.send(err)
        }

        res.json({success:true})
      })
    }
  })

module.exports = router;
