var mongoose = require('mongoose')
var Schema = mongoose.Schema

var listSchema = new Schema({
  name : String,
  desc : String,
  mods : {type: String, default:""},
  creator: {type:String, default:"Default"},
  created_date : {type:Date, default:Date.now},
  url_id: String
})

var List = mongoose.model('List', listSchema)
module.exports = List
