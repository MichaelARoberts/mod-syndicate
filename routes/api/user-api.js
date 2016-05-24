var express = require('express')
var router = express.Router()
var User = require('../../models/user-model.js')

var multer = require('multer')
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
  {name:'username'},
  {name:'password'},
  {name:'email'},
  {name:'fname'},
  {name:'lname'},
  {name:'age'},
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

  .post(userUpload, function(req,res,next){
    User.findOne({username : req.body.username}, function(err,user){
      if(err){
        res.send(err)
      }

      user.comparePassword(req.body.password, function(err, isMatch){
        if(err){
          res.send(err)
        } else {
          req.session.username = req.body.username
          res.json(user)
        }
      })
    })
  })

module.exports = router;
