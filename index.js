const printer = require("printer");
const util = require('util');
const io = require('socket.io-client');

const socket = io('http://10.10.10.10:3000');

require('dns').lookup(require('os').hostname(), function (err, add, fam) {
    console.log('addr: '+add);
})

socket.on('connect', () => {
    console.log(socket.connected); // true
});

socket.on('disconnect', () => {
    console.log(socket.connected); // false
});

// handle the event sent with socket.send()
socket.on('getPrinters', () => {
    console.log('getPrinters');
    let printers = printer.getPrinters();
    socket.emit('printer-list', printers)
});


console.log("installed printers:\n"+util.inspect(printer.getPrinters(), {colors:true, depth:10}));
