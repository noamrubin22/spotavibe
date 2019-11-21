const express = require("express");
const router = express.Router();
const User = require("../models/User");
const HeartRate = require("../models/HeartRate");
const cp = require("child_process");
const axios = require('axios');
let BPM;

const loginCheck = () => {
  return (req, res, next) => {
    if (req.user) {
      next();
    } else {
      res.redirect("/");
    }
  };
};

/* GET home page */
router.get("/", loginCheck(), (req, res, next) => {
  // res.send(req.user)
  res.render("data/measurements", {
    user: req.user
  });
});

/* ------------------------------------------------------- GENERATING THE PLAYLIST ------------------------------------------------------ */

const generatePlaylist = async (bpm, genres, accessToken) => {
  return await axios({
    method: 'get',
    url: "https://api.spotify.com/v1/recommendations",
    headers: { Authorization: 'Bearer ' + accessToken },
    params: {
      limit: 5,
      seed_genres: genres,
      market: 'from_token',
      tempo: bpm
    }
  })
}

/* ---------------------------------------------------- Generating a NEW Access Token --------------------------------------------------- */

// const generateAccessToken = async (refreshToken) => {
//   console.log("HELL YEA!")

//   return await axios({
//     method: 'post',
//     url: "https://accounts.spotify.com/api/token",
//     params: {
//       grant_type: 'refresh_token',
//       refresh_token: refreshToken
//     },
//     headers: {
//       'Content-Type': 'application/x-www-form-urlencoded',
//       'Authorization': 'Basic ' + process.env.SPOTIFY_CLIENT_ID + ':' + process.env.SPOTIFY_CLIENT_SECRET
//     },
//   })
// }

/* ---------------------------------------------------------- manual BPM input ---------------------------------------------------------- */

// manual BPM input
router.post("/", loginCheck(), (req, res, next) => {
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
      })
        .then(heartrate => {
          generatePlaylist(heartrate.BPM, 'edm', req.user.accessToken)
            .then(playlist => {
              HeartRate.findByIdAndUpdate(heartrate._id, { $set: { playlist: playlist.data.tracks } }, { new: true })
                //Redirect user to Playlist page for the measured heartrate!!!
                .then(updatedHeartrate => {
                  console.log("UPDATED HEART RATE>>> " + updatedHeartrate)
                  res.redirect(`/profile/playlist/${updatedHeartrate._id}`)
                })
            })
            .catch(err => {
              next(err)
            })
        })
        .catch(err => {
          next(err);
        });
    })
    .catch(err => {
      next(err);
    });
})

// tap option
router.get("/tap", loginCheck(), (req, res, next) => {
  console.log("tap option clicked")
  res.render("data/tapexplan.hbs")
})

router.post("/tap", loginCheck(), (req, res, next) => {
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
router.get("/arduino", loginCheck(), (req, res, next) => {
  console.log("redirected to arduino explanation");
  res.render("data/ardunexplan.hbs");
})

router.post("/arduino", loginCheck(), (req, res, next) => {
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