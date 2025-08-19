const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();
const Anime = require('../models/anime');



// Middleware to verify token and set req.user
function verifyToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader?.split(' ')[1];

  if (!token) return res.status(401).json({ message: 'Missing token' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ message: 'Invalid token' });
  }
}



// POST /api/anime/add
router.post("/add", verifyToken, async (req, res) => {
  const { listType, anime } = req.body;

  if (!["watching", "completed", "favorites", "planToWatch"].includes(listType)) {
    return res.status(400).json({ message: "Invalid list type." });
  }

  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found." });

    // Check if anime already exists in Anime collection
    let existingAnime = await Anime.findOne({ mal_id: anime.mal_id });
    if (!existingAnime) {
      existingAnime = new Anime(anime);
      await existingAnime.save();
    }

    // Check if the anime is already in the user's list
    const list = user.animeLists[listType];
    const alreadyInList = list.some(id => id.equals(existingAnime._id));
    if (alreadyInList) {
      return res.status(409).json({ message: "Anime already in list" });
    }

    // Push ObjectId into list
    user.animeLists[listType].push(existingAnime._id);
    await user.save();

    res.json({ message: "Anime added!", list: user.animeLists[listType] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;

// GET /api/anime/list/:listType
router.get('/list/:listType', verifyToken, async (req, res) => {
  const { listType } = req.params;

  if (!["watching", "completed", "favorites", "planToWatch"].includes(listType)) {
    return res.status(400).json({ message: "Invalid list type." });
  }

  try {
    const user = await User.findById(req.user.id).populate(`animeLists.${listType}`);

    if (!user) return res.status(404).json({ message: "User not found." });

    res.json({
      listType,
      animeList: user.animeLists[listType] // now full anime objects, not just IDs
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

//REMOVE ROUTE
router.post("/remove", verifyToken, async (req, res) => {
  const { listType, mal_id } = req.body;

  if (!["watching", "completed", "favorites", "planToWatch"].includes(listType)) {
    return res.status(400).json({ message: "Invalid list type." });
  }

  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found." });

    const animeToRemove = await Anime.findOne({ mal_id });
    if (!animeToRemove) return res.status(404).json({ message: "Anime not found." });

    const list = user.animeLists[listType];
    const index = list.findIndex(id => id.equals(animeToRemove._id));
    if (index === -1) return res.status(404).json({ message: "Anime not in list." });

    list.splice(index, 1); // remove the anime from the list
    await user.save();

    res.json({ message: "Anime removed!", list });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});


