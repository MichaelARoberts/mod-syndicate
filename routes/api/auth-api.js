var express = require('express')
var router = express.Router()
var User = require('../../models/user-model.js')
var bcrypt = require('bcrypt')
var jwt    = require('jsonwebtoken');

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
  {name: 'profile_pic_location'}
])

router.route('/auth')
  .post(userUpload,function(req,res,next){
    User.findOne({username : req.body.username}).select('+password').exec(function(err,user){
      if(err){
        res.send(err)
      }

      console.log(req.body.password)
      console.log(user.password)
      bcrypt.compare(req.body.password, user.password,function(err, isMatch) {
        if (err) {
          res.json({
            success:false
          })
        }

        if (isMatch === true){
          var token = jwt.sign(user, 'supersecret')
          req.session.username = user.username
          req.session.token = token

          res.json({
            success: true,
            token: token
          });
        }
      })
    })
  })


  router.route('/users')

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
module.exports = router;
