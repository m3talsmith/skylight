var app = {};

app.light = new Light({
  socket: io.connect('http://localhost:1337')
});

app.switch = new Switch(
  [app.light],
  {socket: io.connect('http://localhost:1337')}
);
