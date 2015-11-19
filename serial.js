var com = require("serialport");
var SerialPort = com.SerialPort;

require("serialport").list(function (err, ports) {
    ports.forEach(function (port) {
        if (port.pnpId) {
            console.log(port.comName);
            console.log(port.pnpId);
            console.log(port.manufacturer);
        }
    });
});

var serialPort = new SerialPort("/dev/ttyACM0", {
    baudrate: 115200,
    parser: com.parsers.readline('\r\n')
});

serialPort.on('open', function () {
    console.log('Port open');
});

var timestamp = parseInt(Date.now() / 1000);

_this = this;
serialPort.on('data', function (data) {
    if (parseInt(Date.now() / 1000) != timestamp) {
        console.log(data);
        timestamp = parseInt(Date.now() / 1000);
        if (_this.handlers.length) {
            _this.handlers.forEach(function (handler) {
                handler(data);
            });
        }
    }
});

this.handlers = [];

exports.addDataHandler = function (handler) {
    this.handlers.push(handler);
};
