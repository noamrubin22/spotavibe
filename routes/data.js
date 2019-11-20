const express = require("express");
const router = express.Router();
const User = require("../models/User");
const cp = require("child_process");

/* GET home page */
router.get("/", (req, res, next) => {
  // res.send(req.user)
  res.render("data/measurements", { user: req.user });
});

// manual BPM input
router.post("/", (req, res, next) => {
  const manualBPM = req.body.manualBPM;
  console.log("BPM: ", manualBPM)
  //find user
  // User.findById({
  //   user: req.user._id
  // })

  // create heartbeat

  // redirect to home screen
  res.render("data/output")
})

// tap option
router.get("/tap", (req, res, next) => {
  console.log("tap option clicked")
  res.render("data/tapexplan.hbs")
})

// arduino option
router.get("/arduino", (req, res, next) => {
  console.log("redirected to arduino explanation");
  res.render("data/ardunexplan.hbs");
})

router.post("/arduino", (req, res, next) => {
  const arduinoPort = req.body.arduinoPort;
  // created child for childprocessing Arduino -serialport ["/dev/cu.wchusbserial1410"]
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
      // correct for outliers by movement
      if (message < 110 && message > 55) {
        heartData.push(message);
      }
      // kill child when array is full
      if (heartData.length > 12) {
        child.send(child.kill())
      }
    }

    // calculate average BPM
    BPM = heartData.reduce((acc, val) => acc + val, 0) / heartData.length;
    console.log("average: ", BPM);

  });

  // child get killed after arduino finishing running
  child.on("exit", () => {
    console.log("child terminated!");
  });

  // find user .findById
  //user =req.user._id

  //     HeartRate.create({
  //         BPM: BPM,
  //         date: Date.now,
  //         method: "arduino",
  //         user: req.user._id
  //       }).then(heartrate => {
  //           res.redirect(`/data/${heartrate._id`)
  // }).catch(err => {
  //    next(err);
  // })

  res.render("data/newheart");
});

module.exports = router;