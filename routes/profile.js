const express = require('express');
const router = express.Router();
const User = require('../models/User')
const axios = require('axios')

router.get('/', (req, res, next) => {
  res.render('profile/stats.hbs', { user: req.user })
})

router.get('/playlist', (req, res, next) => {
  res.render('profile/playlist.hbs', { user: req.user })
})

/* --------------------------------------------------------- AXIOS API REQUESTS --------------------------------------------------------- */





module.exports = router;