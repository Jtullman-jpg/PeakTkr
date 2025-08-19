const mongoose = require('mongoose');

const animeSchema = new mongoose.Schema({
  mal_id: {
    type: Number,
    required: true,
    unique: true
  },
  title: {
    type: String,
    required: true
  },
  image_url: String,
  synopsis: String,
  episodes: Number,
  score: Number
});

module.exports = mongoose.model('Anime', animeSchema);
