var serialport = require('serialport');
var logger = require('./logger');

var devices = [];
var socket = null;

exports.addDevice = function (device) {
    devices.push(device);
    open_serial_connection(device);
};

exports.setSocket = function (socket_) {
    socket = socket_;
};

function open_serial_connection(device) {
    device.options.parser = serialport.parsers.readline('\r\n');
    var serial_port = new serialport.SerialPort(device.path, device.options);

    serial_port.on('open', function () {
        logger.log('Port open: ' + device.path);
        socket.emit('new device', device.name);
        serial_port.on('data', function (data) {
            read_serial_data(device.name, data);
        });
    });
}

function read_serial_data(device_name, data) {
    socket.emit('device message', {
        device_name: device_name,
        data: data
    })
}
