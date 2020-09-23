const printer = require("printer");
const util = require('util');
const io = require('socket.io-client');

const socket = io('http://10.10.10.10:3000');

const { networkInterfaces } = require('os');

const nets = networkInterfaces();
const results = Object.create(null); // or just '{}', an empty object

for (const name of Object.keys(nets)) {
    for (const net of nets[name]) {
        // skip over non-ipv4 and internal (i.e. 127.0.0.1) addresses
        if (net.family === 'IPv4' && !net.internal) {
            if (!results[name]) {
                results[name] = [];
            }

            results[name].push(net.address);
        }
    }
}

console.log(results)

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
