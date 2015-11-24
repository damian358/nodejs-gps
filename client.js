var server_address = 'http://localhost:3000';
var client_name = 'client1';
var devices_file_path = 'devices.json';

var argv = require('yargs').argv;

if (argv.address) {
    server_address = argv.address;
}

if (argv.name) {
    client_name = argv.name;
}

if (argv.devices) {
    devices_file_path = argv.devices;
}

var socket = require('socket.io-client')(server_address);
var fs = require('fs');
var serial = require('./serial');
var logger = require('./logger');

logger.enable();

socket.on('connect', function () {
    socket.emit('new device', client_name);
});

socket.on('connect_error', function (err) {
    logger.log('Cannot connect to ' + server_address);
    logger.log(err);
});

var devices = JSON.parse(fs.readFileSync(devices_file_path, 'utf8'));

serial.addDevices(devices);

serial.addDataHandler(function (data) {
    socket.emit('chat message', data)
});
