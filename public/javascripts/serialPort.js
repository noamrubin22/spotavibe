// require serialport library
const serialport = require("serialport");

// second argument that is given is the name of the port
const portName = process.argv[2];

// holds data that comes in from the serialport
// reads until newline character
const Readline = serialport.parsers.Readline;

// new port holds the properties held by arduino
let port = new serialport(portName, {
    baudRate: 9600,
    dataBits: 8,
    parity: "none",
    stopBits: 1,
    flowControl: false
});

// create a parse element in order to convert data into string
let parser = port.pipe(
    new Readline({
        delimiter: "\n"
    })
);

parser.on("data", function (data) {
    var bits = data;
    // bits being translater into string
    readSerialData(bits);
});

port.on("open", function () {
    console.log("Open connections!");
});

port.on("close", function () {
    console.log("Port is closed.");
});

port.on("error", function () {
    console.log("ERROR: Something went wrong.");
});

function readSerialData(data) {
    // clean data
    data = data.trim();

    // turn into number
    data = Number(data);

    // send data to parent
    if (process.send) {
        process.send(data);
    }
}