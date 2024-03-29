var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session')
var jwt = require('jsonwebtoken');

// User routes
var routes = require('./routes/index');
var lists = require('./routes/lists');
var mods = require('./routes/mods');
var userManagement = require('./routes/user-management.js')

// Api routes
var authAPI = require('./routes/api/auth-api.js')
var listsAPI = require('./routes/api/list-api.js');
var usersAPI = require('./routes/api/user-api.js');
var modAPI = require('./routes/api/mod-api.js');

var mongoose = require('mongoose')
mongoose.connect('mongodb://localhost/ms_db');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
    secret : "SHUUUUSH",
    saveUninitialized: true,
    resave : false
}))

var secureRouter = express.Router()
secureRouter.use(function(req, res, next) {
  var token = req.body.token || req.query.token || req.headers['x-access-token'] || req.session.token;

  if (token) {
    jwt.verify(token, 'supersecret', function(err, decoded) {
      if (err) {
        return res.json({ success: false, message: 'Failed to authenticate token.' });
      } else {
        req.decoded = decoded;
        next();
      }
    });
  } else {
    return res.status(403).send({
      success: false,
      message: 'No token provided.'
    });
  }

});

app.use('/', routes);
app.use('/', lists);
app.use('/', mods);
app.use('/', userManagement);

app.use('/api', authAPI);
//app.use('/api', secureRouter);
app.use('/api', listsAPI);
app.use('/api', usersAPI);
app.use('/api', modAPI);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});




module.exports = app;
