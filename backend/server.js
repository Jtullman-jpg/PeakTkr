const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

dotenv.config();

const app = express();

// ✅ CORRECT CORS SETUP — only one call
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

app.use(express.json());


// Get port from .env or use 5000
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log("✅ Connected to MongoDB");
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
})
.catch((err) => {
  console.error("❌ MongoDB connection error:", err);
});

// Basic test route
app.get('/', (req, res) => {
  res.send("🎉 Your server is running!");
});

//Auth link
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

//anime link
const animeRoutes = require('./routes/anime');
app.use('/api/anime', animeRoutes);

//review link
const reviewRoutes = require('./routes/reviews');
app.use('/api/reviews', reviewRoutes);




