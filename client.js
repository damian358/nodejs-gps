var server_address = 'http://localhost:3000';
var socket = require('socket.io-client')(server_address);
var serial = require('./serial');
var logger = require('./logger');

logger.enable();

socket.on('connect', function () {
    socket.emit('new device', 'hello i am client');
});

socket.on('connect_error', function (err) {
    logger.log('Cannot connect to ' + server_address);
    logger.log(err);
});

serial.addDevice('/dev/ttyUSB0', {
    baudrate: 4800
});

serial.addDevice('/dev/ttyACM0', {
    baudrate: 115200
});

serial.addDataHandler(function (data) {
    socket.emit('chat message', data)
});
