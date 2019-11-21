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
  res.render("data/measurements", {
    user: req.user
  });
});

/* ------------------------------------------------------- GENERATING THE PLAYLIST ------------------------------------------------------ */

const generatePlaylist = async (bpm, genres, accessToken) => {
  return await axios({
    method: 'get',
    url: "https://api.spotify.com/v1/recommendations",
    headers: {
      Authorization: 'Bearer ' + accessToken
    },
    params: {
      limit: 10,
      seed_genres: genres,
      market: 'from_token',
      tempo: ((bpm + 60) / 2)
    }
  })
}

/* ---------------------------------------------------------- manual BPM input ---------------------------------------------------------- */

router.get("/manual", loginCheck(), (req, res, next) => {
  res.render('data/manualBPM', {
    user: req.user
  })
})

router.post("/manual", loginCheck(), (req, res, next) => {
  console.log(req.body.genre)
  let BPM = req.body.manualBPM;
  let targetBPM = ((Number(BPM) + 60) / 2);
  let genre = req.body.dropdown
  let playlistName = req.body.playlistName
  //find user
  User.findById(req.user._id)
    .then(user => {

      // check if all input is given
      if (!req.body.manualBPM || !req.body.playlistName) {
        console.log("no BPM")
        res.render("data/manualBPM", {
          errorMessage: "Please enter a BPM and give your playlist a name"
        });
        return;
      }

      if (!Number(req.body.manualBPM)) {
        res.render("data/manualBPM", {
          errorMessage: "BPM should be a number"
        });
        return;
      }
      // console.log(user);
      //add heartrate data to the database
      HeartRate.create({
          BPM: BPM,
          targetBPM: targetBPM,
          genre: genre,
          playlistName: playlistName,
          date: Date.now(),
          method: "manual",
          user: user
        })
        //Generate the Playlist and push into relevant heartrate model doc
        .then(heartrate => {
          generatePlaylist(heartrate.BPM, genre, req.user.accessToken)
            .then(playlist => {
              HeartRate.findByIdAndUpdate(heartrate._id, {
                  $set: {
                    playlist: playlist.data.tracks
                  }
                }, {
                  new: true
                })
                //Redirect user to Playlist page for the measured heartrate!!!
                .then(updatedHeartrate => {
                  // console.log("UPDATED HEART RATE>>> " + updatedHeartrate)
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

/* ------------------------------------------------------------- tap option ------------------------------------------------------------- */

router.get("/tap", loginCheck(), (req, res, next) => {
  console.log("tap option clicked")
  res.render("data/tapexplan.hbs", {
    user: req.user
  })
})

router.get("/tapper", loginCheck(), (req, res, next) => {
  console.log("tapper")
  res.render("data/tapper.hbs", {
    user: req.user
  });
})


router.post("/tapper", loginCheck(), (req, res, next) => {
  let BPM = req.body.avgBPM
  let targetBPM = ((Number(BPM) + 60) / 2);
  let genre = req.body.dropdown
  let playlistName = req.body.playlistName
  console.log("got into post")

  //find user
  User.findById(req.user._id)
    .then(user => {

      // make sure playlist has a name
      if (!req.body.playlistName) {
        console.log("noplaylistname")
        res.render("data/tapper", {
          errorMessage: "Please give a name to your playlist"
        });
        return;
      }

      //add heartrate data to the database
      HeartRate.create({
          BPM: BPM,
          targetBPM: targetBPM,
          genre: genre,
          playlistName: playlistName,
          date: Date.now(),
          method: "tap",
          user: user
        }).then(heartrate => {
          console.log("created heartrate")
          generatePlaylist(heartrate.BPM, genre, heartrate.user.accessToken)
            .then(playlist => {
              HeartRate.findByIdAndUpdate(heartrate._id, {
                  $set: {
                    playlist: playlist.data.tracks
                  }
                }, {
                  new: true
                })
                //Redirect user to Playlist page for the measured heartrate!!!
                .then(updatedHeartrate => {
                  res.redirect(`/profile/playlist/${updatedHeartrate._id}`)
                })
            }).catch(err => {
              console.log(err)
            })
            .catch(err => {
              console.log(err)
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

/* ----------------------------------------------------------- arduino option ----------------------------------------------------------- */

router.get("/arduino", loginCheck(), (req, res, next) => {
  console.log("redirected to arduino explanation");
  res.render("data/ardunexplan.hbs", {
    user: req.user
  });
})

router.post("/arduino", loginCheck(), (req, res, next) => {
  let playlistName = req.body.playlistName;
  let genre = req.body.dropdown
  const arduinoPort = req.body.arduinoPort;

  // make sure playlist has a name
  if (!req.body.playlistName) {
    console.log("noplaylistname")
    res.render("data/ardunexplan", {
      errorMessage: "Please give a name to your playlist"
    });
    return;
  }

  // make sure playlist has a name
  if (!req.body.arduinoPort) {
    console.log("noplaylistname")
    res.render("data/ardunexplan", {
      errorMessage: "Please determine your Arduino port"
    });
    return;
  }
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
      if (heartData.length > 12) {
        child.send(child.kill())
        console.log("kiiiiiiiilllllllll")

        // calculate average BPM
        BPM = Math.round(heartData.reduce((acc, val) => acc + val, 0) / heartData.length);
        let targetBPM = ((Number(BPM) + 60) / 2);
        console.log("average: ", BPM);

        // create heartratemodel for user
        User.findById(req.user._id)
          .then(user => {
            console.log(user);

            //add heartrate data to the database
            HeartRate.create({
              BPM: BPM,
              targetBPM: targetBPM,
              genre: genre,
              playlistName: playlistName,
              date: Date.now(),
              method: "arduino",
              user: user
            }).then(heartrate => {
              generatePlaylist(heartrate.BPM, genre, heartrate.user.accessToken)
                .then(playlist => {
                  HeartRate.findByIdAndUpdate(heartrate._id, {

                      $set: {
                        playlist: playlist.data.tracks
                      }
                    }, {
                      new: true
                    })
                    //Redirect user to Playlist page for the measured heartrate!!!
                    .then(updatedHeartrate => {
                      res.redirect(`/profile/playlist/${updatedHeartrate._id}`)
                    })
                }).catch(err => {
                  console.log(err)
                })
            })
          })
      }
    }
    // termintate child
    child.on("exit", () => {
      console.log("child terminated!");
    });
  })
})

/* ----------------------------------------------------- axios request from backend ----------------------------------------------------- */

router.get("/getplaylist", (req, res, next) => {
  HeartRate.find({
      user: req.user._id
    })
    .then(found => {
      res.json(found);
    }).catch(err => {
      console.log(err)
    })
})



module.exports = router;