var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var fs = require('fs');
var http = require('http');
var https = require('https');

var routes = require('./routes/index');

// var options = {
//   key: fs.readFileSync('server.key'),
//   cert: fs.readFileSync('server.crt')
// };

var app = express();

// create http and https servers
// var httpServer = http.createServer(app);
// var httpsServer = https.createServer(options, app).listen(443);


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use('/', routes);

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

// Socketio components
var io = require('socket.io')(app);

io.on('connection', function(client) {
    console.log("New client");

    client.on('change', function(data) {
        room = json['room'];
        io.broadcast.to(room).emit('draw', {'data': room});
    });

    client.on('join', function(data) {
        room = json['room'];
        io.join(room);
        io.broadcast.to(room).emit('join', {'data': room});
    });

    client.on('leave', function(data) {
        room = json['room'];
        io.leave(room);
        io.broadcast.to(room).emit('leave', {'data': room});
    });
});


module.exports = app;
