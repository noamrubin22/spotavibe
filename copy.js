// serialport.js
// require serialport library
const serialport = require("serialport");

// second argument that is given is the name of the port
const portName = process.argv[2];

// create empty array
let dataHeart = [];

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
  console.log(dataHeart);
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

  // push to data array
  //dataHeart.push(data);
  console.log("data: " + data);
  if (process.send) {
    process.send(data);
  }
  if (dataHeart.length > 5) {
    console.log(".disconnect()");
    process.exit();
  }
}

///////////data.js
const express = require("express");
const router = express.Router();
const User = require("../models/User");
// const io = require("socket.io")();
// var sys = require("util");
var cp = require("child_process");

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("data/heartbeat");
});

router.post("/", (req, res, next) => {
  const arduinoPort = req.body.arduinoPort;
  // created child for childprocessing Arduino -serialport
  // ["/dev/cu.wchusbserial1410"]
  let child = cp.fork("serialPort.js", [arduinoPort], {
    cwd: "./public/javascripts/",
    stdio: ['pipe', 'pipe', 'pipe', 'ipc']
  });

  let heartData = [];
  // parent listens to the child
  child.on('message', message => {
    console.log('message from child:', message);

    // push heartData into array
    if (!!Number(message)) {
      heartData.push(message);
    }
    //child.send('Hi');
  });

  // child get killed after arduino finishing running
  child.on("exit", () => {
    console.log("child terminated!");
  });

  res.render("data/newheart");
});

module.exports = router;