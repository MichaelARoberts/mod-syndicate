var mongoose = require('mongoose')
var Schema = mongoose.Schema

var listSchema = new Schema({
  name : String,
  desc : String,
  html_desc : String,
  mods : {type: String, default:""},
  game : String,
  creator: String,
  created_date : {type:Date, default:Date.now},
  updated_date : {type:Date, default:Date.now},
  url_id: String,
  likes: {type: Number, default:0},
  image_loc : String,
  views: {type: Number, default:0}
})

var List = mongoose.model('List', listSchema)
module.exports = List
