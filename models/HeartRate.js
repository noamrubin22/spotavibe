const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const heartRateSchema = new Schema({
  BPM: Number,
  targetBPM: Number,
  genre: String,
  playlistName: String,
  date: Date,
  method: {
    type: String,
    enum: ["arduino", "tap", "manual"]
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User"
  },
  playlist: Array
});

const HeartRate = mongoose.model('HeartRate', heartRateSchema);
module.exports = HeartRate;