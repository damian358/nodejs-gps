var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var logger = require('../lib/logger');

var devices = [];

logger.enable();

app.use(express.static(__dirname + '/public'));

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', function (socket) {
    logger.log('new connection');

    socket.on('login', function () {
        devices.forEach(function (device) {
            socket.emit('new device', device);
        });
    });

    socket.on('device message', function (msg) {
        io.emit('device message', msg);
    });

    socket.on('new device', function (device) {
        if (devices.indexOf(device) > -1) {
            return;
        }

        devices.push(device);
        logger.log('new device: ' + device);
        io.emit('new device', device);
    });
});

http.listen(3000, function () {
    console.log('listening on *:3000');
});
