var mongoose = require('mongoose')
var Schema = mongoose.Schema
var bcrypt = require('bcrypt')
var SALT_VAL = 10;

var userSchema = new Schema({
  username: {type:String, required:true, unique:true, dropDups:true},
  password: {type:String, required:true, unique:true},
  email : {type:String, required:true, unique:true},
  date: {type:Date, default:Date.now},
  fname: String,
  lname: String,
  age: Number
})


userSchema.pre('save', function(next) {
  var user = this;

  if (!user.isModified('password')) return next()

  bcrypt.genSalt(SALT_VAL, function(err, salt) {
    if (err) return next(err)

    // hash the password along with our new salt
    bcrypt.hash(user.password, salt, function(err, hash) {
        if (err) return next(err)

        // override the cleartext password with the hashed one
        user.password = hash
        next()
    })
  })
})

userSchema.methods.comparePassword = function(password, cb) {
  bcrypt.compare(password, this.password, function(err, isMatch){
    if (err) return cb(err)
    cb(null, isMatch)
  })
}
var User = mongoose.model('User', userSchema)
module.exports = User
