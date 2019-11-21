const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: String,
  password: String,
  spotifyId: String,
  accessToken: String,
  refreshToken: String,
  userPhoto: String,
  userJson: Object,
  heartrate: [{ type: Schema.Types.ObjectId, ref: 'HeartRate' }]
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
});

const User = mongoose.model('User', userSchema);
module.exports = User;

// new url test git