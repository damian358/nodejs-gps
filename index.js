var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var com = require("serialport");
var SerialPort = require("serialport").SerialPort;


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

serialPort.on('data', function (data) {
    console.log(data);
});

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', function (socket) {
    socket.on('chat message', function (msg) {
        io.emit('chat message', msg);
    });
});

http.listen(3000, function () {
    console.log('listening on *:3000');
});
