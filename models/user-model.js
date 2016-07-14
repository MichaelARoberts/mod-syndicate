var mongoose = require('mongoose')
var Schema = mongoose.Schema
var bcrypt = require('bcrypt')
var SALT_VAL = 10;

var userSchema = new Schema({
  username: {type:String, required:true, unique:true, dropDups:true},
  password: {type:String, required:true, select:false},
  email : {type:String, required:true},
  join_date: {type:Date, default:Date.now},
  fname: String,
  lname: String,
  age: Number,
  mod_downloads: Array,
  profile_pic_loc : String,
  bio : {type:String, default:''},
  twitter_link : {type:String, default:''},
  facebook_link : {type:String, default:''},
  comments : Array,
  created_lists: Array,
  created_mods : Array
})


userSchema.pre('save', function(next) {
  var user = this;

  if (!user.isModified('password')) return next()

  bcrypt.genSalt(SALT_VAL, function(err, salt) {
    if (err) {
      return next(err)
    }

    // hash the password along with our new salt
    bcrypt.hash(user.password, salt, function(err, hash) {
        if (err) {
          return next(err)
        }

        // override the cleartext password with the hashed one
        user.password = hash
        next()
    })
  })
})

var User = mongoose.model('User', userSchema)
module.exports = User
