const express = require('express');
const router = express.Router();
const User = require('../models/User')

router.get('/', (req, res, next) => {
  res.render('profile/profile.hbs', { user: req.user })
})

module.exports = router;