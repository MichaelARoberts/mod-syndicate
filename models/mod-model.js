var mongoose = require('mongoose')
var Schema = mongoose.Schema

var modSchema = new Schema({
  name : (type:String,unique: true),   // The name of the mod
  desc : String,     // Short bit about the mod
  content : String  // More information about the mod
  creator: String,  // Who made the mod
  file : String,    // The location of where our file is
  created_at : {type:Date, default:Date.now} // The date the file was created
  updated_at : type:Date                     // The date the file is updated
})

var List = mongoose.model('List', listSchema)
module.exports = List
