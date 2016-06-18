var mongoose = require('mongoose')
var Schema = mongoose.Schema

var modSchema = new Schema({
  name : {type:String,unique: true},   // The name of the mod
  url_id : String,
  desc : String,     // Short bit about the mod
  html_desc : String,
  content : String , // More information about the mod
  creator: String,  // Who made the mod
  file_loc : String,    // The location of where our file is
  images_loc : String,  // An Array of where all our images are
  created_date : {type:Date, default:Date.now}, // The date the file was created
  updated_date : {type:Date, default:Date.now}                   // The date the file is updated
})

var Mod = mongoose.model('Mod', modSchema)
module.exports = Mod
