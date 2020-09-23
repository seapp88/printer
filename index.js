const printer = require("printer");
const util = require('util');
const io = require('socket.io-client');

const socket = io('http://10.10.10.10:3000');

socket.on('connect', () => {
    console.log(socket.connected); // true
});

socket.on('disconnect', () => {
    console.log(socket.connected); // false
});


console.log("installed printers:\n"+util.inspect(printer.getPrinters(), {colors:true, depth:10}));
