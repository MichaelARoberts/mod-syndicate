var express = require('express');
var router = express.Router();
var List = require('../../models/list-model.js')

var multer = require('multer');
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/imgs')
  },
  filename: function (req, file, cb) {
    crypto.pseudoRandomBytes(16, function (err, raw) {
      cb(null, raw.toString('hex') + Date.now() + '.' + mime.extension(file.mimetype));
    });
  }
});

var upload = multer({
  dest:'./public/imgs',
  storage:storage
})

var listUpload = upload.fields([
  {name:'name'},
  {name:'mods'}
])

router.route('/lists')

  .get(function(req, res, next) {
    List.find(function(err, lists) {
      if (err)
          res.send(err);

      res.json(lists);
    })
  })

  .post(listUpload, function(req,res,next) {
    newList = new List({
      name : req.body.name,
      mods : req.body.mods,
      creator : "somePerson"
    })

    newList.save(function(err){
      if (err){
        res.send(err)
      }
      res.json({success:true})
    })
  })

module.exports = router;
