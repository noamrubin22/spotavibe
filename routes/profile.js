const express = require('express');
const router = express.Router();
const HeartRate = require("../models/HeartRate");
const Playlist = require('../models/Playlist')
const User = require('../models/User')
const axios = require('axios')
//const generatePlaylist = require('../public/javascripts/spotify-playlist')


router.get('/stats', (req, res, next) => {
  res.render('profile/stats.hbs', { user: req.user })
})

router.get('/playlist', (req, res, next) => {
  res.render('profile/playlist.hbs', { user: req.user })
})

/* --------------------------------------------------- RENDER PLAYLIST BY HEARTRATE_id -------------------------------------------------- */
router.get('/playlist/:heartrateID', (req, res, next) => {
  let heartrateID = req.params.heartrateID;
  //Use the URL id to get the data from the database of that specific Heartrate measurement
  HeartRate.findById(heartrateID)
    .populate('user')
    .then(heartrateData => {
      console.log("READY TO POPULATE>>>" + heartrateData)
      res.render('profile/playlist', { playlistArr: heartrateData.playlist, heartrateData: heartrateData, user: req.user })
    })
    .catch(err => { console.log(err) })
})


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

router.post('/playlist', async (req, res, next) => {
  let playlist = await generatePlaylist(120, 'edm', req.user.accessToken)
  res.send(playlist.data.tracks[0])
  // console.log("response data from function genPlayl", playList)
})


module.exports = router;