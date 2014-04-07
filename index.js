var http    = require('http'),
    path    = require('path'),
    connect = require('connect'),
    skynet  = require('skynet'),
    socket  = require('socket.io');

var app = connect()
    .use(connect.logger('dev'))
    .use(connect.static(path.join(__dirname, 'public')));

var server = http.createServer(app);

server.listen(1337);

var io = socket.listen(server);

io.sockets.on('connection', function (socket) {
  socket.on('switch:on', function (state, data) {
    data('switch is turned on at server');
    socket.broadcast.emit('light:on', {state: 1});
  });

  socket.on('switch:off', function (state, data) {
    data('switch is turned off at server');
    socket.broadcast.emit('light:off', {state: 0});
  });
});

