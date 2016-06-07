var mongoose = require('mongoose')
var Schema = mongoose.Schema

var listSchema = new Schema({
  name : String,
  desc : String,
  mods : {type: String, default:""},
  game : String,
  creator: String,
  created_date : {type:Date, default:Date.now},
  url_id: String
  likes: Number
  dislikes : Number
})

var List = mongoose.model('List', listSchema)
module.exports = List
