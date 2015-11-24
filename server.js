var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var logger = require('./logger');

logger.enable();

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', function (socket) {
    logger.log('new connection');
    socket.on('chat message', function (msg) {
        io.emit('chat message', msg);
    });

    socket.on('new device', function (msg) {
        logger.log('new device: ' + msg);
        io.emit('chat message', msg);
    });
});

http.listen(3000, function () {
    console.log('listening on *:3000');
});
