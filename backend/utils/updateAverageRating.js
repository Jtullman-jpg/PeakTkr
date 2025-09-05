// utils/updateAverageRating.js
const Review = require('../models/review');
const Anime = require('../models/anime');

const updateAverageRating = async (animeId) => {
  const reviews = await Review.find({ anime: animeId });

  if (reviews.length === 0) {
    await Anime.findByIdAndUpdate(animeId, { averageRating: 0 });
    return;
  }

  const total = reviews.reduce((sum, review) => sum + review.rating, 0);
  const avg = total / reviews.length;

  await Anime.findByIdAndUpdate(animeId, { averageRating: avg.toFixed(2) });
};

module.exports = updateAverageRating;
