const express = require("express");
const router = express.Router();
const User = require("../models/User");
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
  });

  // child get killed after arduino finishing running
  child.on("exit", () => {
    console.log("child terminated!");
  });

  res.render("data/newheart");
});

module.exports = router;