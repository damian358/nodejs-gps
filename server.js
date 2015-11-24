var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var serial = require('./serial');
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

//serial.addDevice('/dev/ttyUSB0', {
//    baudrate: 4800
//});
//
//serial.addDevice('/dev/ttyACM0', {
//    baudrate: 115200
//});

serial.addDataHandler(function (data) {
    io.emit('chat message', data)
});

http.listen(3000, function () {
    console.log('listening on *:3000');
});
