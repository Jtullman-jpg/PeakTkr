const express = require('express');
const router = express.Router();
const Anime = require('../models/anime');
const Review = require('../models/review'); // make sure path is correct

// POST route to create a new review
router.post('/', async (req, res) => {
  try {
    const { anime, user, rating, text } = req.body;

    const newReview = new Review({
      anime,
      user,
      rating,
      text,
    });

    await newReview.save();
    res.status(201).json(newReview);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;
