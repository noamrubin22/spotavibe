const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const playlistSchema = new Schema({
  songs: Array,
  user: String,
})

const Playlist = mongoose.model('Playlist', playlistSchema);
module.exports = Playlist;