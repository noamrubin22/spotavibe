const express = require("express");
const router = express.Router();
const User = require("../models/User");
const HeartRate = require("../models/HeartRate");

/* GET home page */
router.get("/profile/stats", (req, res, next) => {
  console.log(req);
  User.findById(req.user._id)
    .then(user => {
      console.log(user);
      console.log("got into statsuser ")
      // const dates = response.data.map(element => {
      //   return element.date;
      // });
      // console.log(dates);
      // cons = response.data.map(el => {
      //   return el.close;
      // });
      // console.log(closes);

      // drawChart(dates );
    })
    .catch(err => {
      console.log(err);
    });
  res.render("stats");
});

module.exports = router;