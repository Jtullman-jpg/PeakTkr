const express = require('express');
const router = express.Router();
const Anime = require('../models/anime');
const Review = require('../models/review');
const updateAverageRating = require('../utils/updateAverageRating');


// POST route to create a new review
router.post('/', async (req, res) => {
  try {
    const { anime, user, rating, text } = req.body;

    const newReview = new Review({
      anime,
      user,
      rating,
      comment: text,
    });

    await newReview.save();
    //average update
    if (anime) await updateAverageRating(anime);

    res.status(201).json(newReview);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});



module.exports = router;

// GET /api/reviews
router.get("/", async (req, res) => {
  try {
    const filter = {};
    if (req.query.anime) {
      filter.anime = req.query.anime;
    }
    if (req.query.user) {
      filter.user = req.query.user;
    }

    const reviews = await Review.find(filter)
      .populate("user", "username")
      .populate("anime", "title image_url");

    res.status(200).json(reviews);
  } catch (err) {
    res.status(500).json({ error: "Failed to get reviews", details: err.message });
  }
});

// PUT /api/reviews/:id
router.put('/:id', async (req, res) => {
  try {
    const { rating, comment } = req.body;

    // Validate input
    if (rating !== undefined && (rating < 1 || rating > 10)) {
      return res.status(400).json({ message: 'Rating must be between 1 and 10.' });
    }

    // Update the review
    const updatedReview = await Review.findByIdAndUpdate(
      req.params.id,
      { rating, comment },
      { new: true }
    );

    if (!updatedReview) {
      return res.status(404).json({ message: 'Review not found.' });
    }

    //average update
    if (updatedReview.anime) await updateAverageRating(updatedReview.anime);

    res.json(updatedReview);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE /api/reviews/:id
router.delete('/:id', async (req, res) => {
  try {
    const deletedReview = await Review.findByIdAndDelete(req.params.id);

    if (!deletedReview) {
      return res.status(404).json({ message: 'Review not found.' });
    }

    //average update
    if (deletedReview.anime) await updateAverageRating(deletedReview.anime);

    res.json({ message: 'Review deleted.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});





