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
  // const arduinoPort = req.params.arduinoPort;
  // created child for childprocessing Arduino -serialport
  let child = cp.fork("serialPort.js", ["/dev/cu.wchusbserial1410"], {
    cwd: "./public/javascripts/"
  });
  child.on("exit", () => {
    console.log("child terminated!");
  });

  res.render("data/newheart");
});

module.exports = router;
