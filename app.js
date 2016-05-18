var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mustache = require('mustache');
var request = require('request');
//var _ = require('underscore');

var app = express();

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());


// app.get('/',function(req,res,next){
//   res.json({ r: 'json'});
// });
app.use(function(req, res, next){
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE");
  next();
});

function getURL(username){
  var template = process.env.IMPORT_API_URL || 'https://{{username}}.cartodb.com/api/v1/imports';
  return mustache.to_html(template, {username: username})
}
app.post('/:account',function(req,res,next){

  var account = req.params.account;
  if (!account){
    return next(new Error('Missing account parameter'));
  }


  var options = {
    'url': getURL(account),
    'method': 'POST',
    'json': req.body
  };
  request.post(options).pipe(res);

});

app.get('/:account/:import_id',function(req,res,next){
  
  var account = req.params.account;
  var import_id = req.params.import_id;
  if (!account){
    return next(new Error('Missing account parameter'));
  }
  if (!import_id){
    return next(new Error('Missing import_id parameter'));
  }

  var query = [];

  for (var i in req.query){
    query.push(i + '=' +req.query[i]);
  }

  var url = getURL(account) + '/' + import_id +'?' + query.join('&');

  request.get(url).pipe(res);

});

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
    res.json('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.json('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
