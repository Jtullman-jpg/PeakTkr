const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();

// Register route
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const hashed = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      username,
      email,
      password: hashed
    });

    res.status(201).json({ message: "User created!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Login route
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.json({
      token,
      user: {
        id: user._id,
        username: user.username
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Profile route
router.get('/profile', async (req, res) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ message: 'Missing token' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');

    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json(user);
  } catch (err) {
    res.status(403).json({ message: 'Invalid token' });
  }
});

module.exports = router;
