var mongoose = require('mongoose')
var Schema = mongoose.Schema

var listSchema = new Schema({
  name : String,
  mods : Array,
  creator: String,
  date : {type:Date, default:Date.now}
})

var List = mongoose.model('List', listSchema)
module.exports = List
