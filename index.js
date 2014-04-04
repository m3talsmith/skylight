var express = require('express'),
    path    = require('path'),
    skynet  = require('skynet'),
    socket  = require('socket.io');

var Light  = require('./lib/light'),
    Switch = require('./lib/switch');

var app = express();

app.use(
  express.static(
    path.join(__dirname, 'public')
  )
);

socket.listen(app.listen(1337));
