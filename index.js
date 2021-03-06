const printer = require("printer");
const util = require('util');
const io = require('socket.io-client');

const socket = io('https://alivero.jelastic.regruhosting.ru/');

const { networkInterfaces } = require('os');

const nets = networkInterfaces();
const results = []; // or just '{}', an empty object

for (const name of Object.keys(nets)) {
    for (const net of nets[name]) {
        // skip over non-ipv4 and internal (i.e. 127.0.0.1) addresses
        if (net.family === 'IPv4' && !net.internal) {
            if (!results.filter(i => i.name === name)[0]) {
                // results[name] = [];
            }

            results.push({name, address: net.address});
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
    socket.emit('ip-list', results);
    let printers = printer.getPrinters();
    socket.emit('printer-list', printers);
});

socket.on('print', (data) => {
    console.log(data)
    printer.printDirect({
        data: data.zpl,
        printer: data.printer,
        type: "RAW",
        success:function(){
            console.log("printed:");
        }, error:function(err){console.log(err);}
    });
});


console.log("installed printers:\n"+util.inspect(printer.getPrinters(), {colors:true, depth:10}));
