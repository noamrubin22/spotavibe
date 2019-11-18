const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const heartRateSchema = new Schema({
  BPM: Number,
  date: Date,
  method: {
    type: String,
    enum: ["arduino", "tap", "text-input"]
  },
  comments: [{
    type: Schema.Types.ObjectId,
    ref: "Comment"
  }],
  user: {
    type: Schema.Types.ObjectId,
    ref: "User"
  }
});

const HeartRate = mongoose.model('HeartRate', heartRateSchema);
module.exports = User;