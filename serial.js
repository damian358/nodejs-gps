var com = require("serialport");
var logger = require('./logger');

var SerialPort = com.SerialPort;

this.handlers = [];
_this = this;

exports.addDataHandler = function (handler) {
    _this.handlers.push(handler);
};

require("serialport").list(function (err, ports) {
    ports.forEach(function (port) {
        if (port.pnpId) {
            logger.log(port.comName);
            logger.log(port.pnpId);
            logger.log(port.manufacturer);
        }
    });
});

var serialPort = new SerialPort("/dev/ttyACM0", {
    baudrate: 115200,
    parser: com.parsers.readline('\r\n')
});

serialPort.on('open', function () {
    logger.log('Port open');
});

var timestamp = parseInt(Date.now() / 1000);

serialPort.on('data', function (data) {
    if (parseInt(Date.now() / 1000) != timestamp) {
        logger.log(data);
        timestamp = parseInt(Date.now() / 1000);
        _this.handlers.forEach(function (handler) {
            handler(data);
        });
    }
});

