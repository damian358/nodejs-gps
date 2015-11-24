var serialport = require('serialport');
var logger = require('./logger');

var handlers = [];
var devices = [];

function open_serial_connection(device) {
    device.options.parser = serialport.parsers.readline('\r\n');
    var serial_port = new serialport.SerialPort(device.path, device.options);

    serial_port.on('open', function () {
        logger.log('Port open: ' + device.path);
        serial_port.on('data', read_serial_data);
    });
}

function read_serial_data(data) {
    logger.log(data);
    handlers.forEach(function (handler) {
        handler(data);
    });
}

exports.addDevice = function (device) {
    devices.push(device);
    open_serial_connection(device);
};

exports.addDevices = function (devices) {
    devices.forEach(exports.addDevice);
};

exports.addDataHandler = function (handler) {
    handlers.push(handler);
};
