var argv = require('yargs')
    .usage('Usage: $0 <command> [options]')
    .help('h')
    .alias('h', 'help')
    .describe('address', 'Chat server address, must be full url')
    .describe('devices', 'Path to file containing device definitions')
    .default({
        address: 'http://localhost:3000',
        devices: 'devices.json'
    })
    .example('$0 --address="http://127.0.0.1" --devices="./devices.json"')
    .argv;

var server_address = argv.address;
var devices_file_path = argv.devices;

var socket = require('socket.io-client')(server_address);
var fs = require('fs');
var serial = require('./serial');
var logger = require('./logger');

logger.enable();

socket.on('connect', function () {
    var devices = JSON.parse(fs.readFileSync(devices_file_path, 'utf8'));

    devices.forEach(function (device) {
        serial.addDevice(device);
    });

    serial.setSocket(socket);
});

socket.on('connect_error', function (err) {
    logger.log('Cannot connect to ' + server_address);
    logger.log(err);
});
