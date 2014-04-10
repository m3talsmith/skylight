var http    = require('http'),
    path    = require('path'),
    connect = require('connect'),
    skynet  = require('skynet'),
    socket  = require('socket.io');

var app = connect()
    .use(connect.logger('dev'))
    .use(connect.static(path.join(__dirname, 'public')));

var server = http.createServer(app);

server.listen(process.env.PORT || 1337);

var io = socket.listen(server);

io.sockets.on('connection', function (socket) {
  socket
    .on('mouse:move', function (mouse, callback) {
      if(callback) callback('coordinates recorded for ' + socket.id);
      socket.broadcast.emit('mouse:move', {
        id: socket.id,
        x : mouse.x,
        y : mouse.y
      });
    })
    .on('mouse:connected', function (mouse, callback) {
      if(callback) callback('mouse connected ' + socket.id);
      socket.broadcast.emit('mouse:connected', {
        id: socket.id,
        x : mouse.x,
        y : mouse.y
      });
    })
    .on('mouse:add', function (mouse, callback) {
      if(callback) callback('mouse added ' + socket.id);
      socket.broadcast.emit('mouse:add', {
        id: socket.id,
        x : mouse.x,
        y : mouse.y
      });
    })
    .on('switch:on', function (state, callback) {
      callback('switch is turned on at server for ' + socket.id);
      socket.broadcast.emit('light:on', {state: 1});
    })
    .on('switch:off', function (state, callback) {
      callback('switch is turned off at server for ' + socket.id);
      socket.broadcast.emit('light:off', {state: 0});
    });
});

