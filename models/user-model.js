var mongoose = require('mongoose')
var Schema = mongoose.Schema

var userSchema = new Schema({
  username: String,
  password: Array,
  date: {type:Date, default:Date.now},
  fname: String,
  lname: String,
  age: Number
})

var User = mongoose.model('User', userSchema)
module.exports = User
