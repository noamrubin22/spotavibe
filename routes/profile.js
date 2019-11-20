const express = require('express');
const router = express.Router();
const Playlist = require('../models/Playlist')
const User = require('../models/User')
const axios = require('axios')
const HeartRate = require("../models/HeartRate");
// const loginCheck = require("../public/javascripts/loginCheck")

//const generatePlaylist = require('../public/javascripts/spotify-playlist')

const loginCheck = () => {
  return (req, res, next) => {
    if (req.user) {
      next();
    } else {
      res.redirect("/");
    }
  };
};

// let arrBPM;
// let arrDates;

router.get("/stats", loginCheck(), (req, res, next) => {

  // find user
  HeartRate.find({
      user: req.user._id
    })
    .then(heartrate => {
      // create empty arrays
      arrBPM = [];
      arrDates = [];
      heartrate.forEach(el => {
        // extra checks for existance BPM
        if (!!el.BPM) {
          arrBPM.push(el.BPM)

          // turn dates into more readable format
          let newdate = el.date.getDate() + "/" + (el.date.getMonth() + 1) + "/" + el.date.getFullYear();
          console.log(newdate)
          arrDates.push(newdate);
          console.log(arrDates);
        } else {
          // create button
          // const mess = 1;
        }
      })
    }).then(() =>
      res.render("profile/stats", {
        arrBPM: JSON.stringify(arrBPM),
        arrDates: JSON.stringify(arrDates),
      }))
    .catch(err => {
      console.log(err);
    });

});

router.get('/playlist', loginCheck(), (req, res, next) => {
  res.render('profile/playlist.hbs', {
    user: req.user
  })
})

const generatePlaylist = async (bpm, genres, accessToken) => {
  return await axios({
    method: 'get',
    url: "https://api.spotify.com/v1/recommendations",
    headers: {
      Authorization: 'Bearer ' + accessToken
    },
    params: {
      limit: 5,
      seed_genres: genres,
      market: 'from_token',
      tempo: bpm
    }
  })


}

router.post('/playlist', loginCheck(), async (req, res, next) => {
  let playlist = await generatePlaylist(120, 'edm', 'BQCBUKqyuE8E8Lp3Llpl_7_8aPOgFcG770cs-0CryZuQf9OM_U28t_nEQz8e0vJQj3LjIvbZim15oHX_xSvob22rpkxaJ-Gj1ju3iWtm7ANXZnm3MuNWJr37CNQV3NEE-PEoyXDIlUZKa_vLhA')
  res.send(playlist.data.tracks[0])
  // console.log("response data from function genPlayl", playList)

})


module.exports = router;