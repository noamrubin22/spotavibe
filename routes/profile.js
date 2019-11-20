const express = require('express');
const router = express.Router();
const HeartRate = require("../models/HeartRate");
const Playlist = require('../models/Playlist')
const User = require('../models/User')
const axios = require('axios')

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

/* --------------------------------------------------- RENDER PLAYLIST BY HEARTRATE_id -------------------------------------------------- */
router.get('/playlist/:heartrateID', (req, res, next) => {
  let heartrateID = req.params.heartrateID;
  //Use the URL id to get the data from the database of that specific Heartrate measurement
  HeartRate.findById(heartrateID)
    .populate('user')
    .then(heartrateData => {
      console.log("READY TO POPULATE>>>" + heartrateData)
      res.render('profile/playlist', {
        playlistArr: heartrateData.playlist,
        heartrateData: heartrateData,
        user: req.user
      })
    })
    .catch(err => {
      console.log(err)
    })
})


module.exports = router;