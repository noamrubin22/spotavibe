const express = require("express");
const router = express.Router();
const User = require("../models/User");
const HeartRate = require("../models/HeartRate");
const cp = require("child_process");
let BPM;

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("data/measurements");
});

// manual BPM input
router.post("/", (req, res, next) => {
  const BPM = req.body.manualBPM;
  console.log("BPM: ", BPM)

  //find user
  User.findById(req.user._id)
    .then(user => {
      console.log(user);
      //add heartrate data to the database
      HeartRate.create({
          BPM: BPM,
          date: Date.now(),
          method: "manual",
          user: user
        }).then(heartrate => {
          console.log(heartrate);
          // redirect to personal playlist for heartrate
          res.render("data/output")
        })
        .catch(err => {
          next(err);
        });
    }).catch(err => {
      next(err);
    });
})

// tap option
router.get("/tap", (req, res, next) => {
  console.log("tap option clicked")

  res.render("data/tapexplan.hbs")
})

router.post("/tap", (req, res, next) => {
  let BPM = req.body.avgBPM
  console.log("BPM: ", BPM)
  console.log("got into post")

  //find user
  User.findById(req.user._id)
    .then(user => {
      console.log(user);
      //add heartrate data to the database
      HeartRate.create({
          BPM: BPM,
          date: Date.now(),
          method: "tap",
          user: user
        }).then(heartrate => {
          console.log(heartrate);
          // redirect to personal playlist for heartrate
          res.render("data/output")
        })
        .catch(err => {
          next(err);
        });
    }).catch(err => {
      next(err);
    });
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
        console.log(heartData);
      }
      // kill child when array is full
      if (heartData.length > 20) {
        child.send(child.kill())
        console.log("kiiiiiiiilllllllll")

        // calculate average BPM
        BPM = Math.round(heartData.reduce((acc, val) => acc + val, 0) / heartData.length);
        console.log("average: ", BPM);

        // create heartratemodel for user
        User.findById(req.user._id)
          .then(user => {
            console.log(user);

            if (!!BPM) {
              //add heartrate data to the database
              HeartRate.create({
                  BPM: BPM,
                  date: Date.now(),
                  method: "arduino",
                  user: user
                }).then(heartrate => {
                  console.log(heartrate);
                  // redirect to personal playlist for heartrate? patriick??
                  res.render(`data/newheart`)
                })
                .catch(err => {
                  next(err);
                });
            } else {
              //try again
              console.log("try again")
            }
          }).catch(err => {
            next(err);
          });
      }
    }
    // termintate child
    child.on("exit", () => {
      console.log("child terminated!");
    });
  })
})
module.exports = router;