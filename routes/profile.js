const express = require('express');
const router = express.Router();
const Playlist = require('../models/Playlist')
const User = require('../models/User')
const axios = require('axios')
//const generatePlaylist = require('../public/javascripts/spotify-playlist')


router.get('/stats', (req, res, next) => {
  res.render('profile/stats.hbs', {
    user: req.user
  })
})

router.get('/playlist', (req, res, next) => {
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

router.post('/playlist', async (req, res, next) => {
  let playlist = await generatePlaylist(120, 'edm', 'BQCBUKqyuE8E8Lp3Llpl_7_8aPOgFcG770cs-0CryZuQf9OM_U28t_nEQz8e0vJQj3LjIvbZim15oHX_xSvob22rpkxaJ-Gj1ju3iWtm7ANXZnm3MuNWJr37CNQV3NEE-PEoyXDIlUZKa_vLhA')
  res.send(playlist.data.tracks[0])
  // console.log("response data from function genPlayl", playList)

})


module.exports = router;