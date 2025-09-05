const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email:    { type: String, required: true, unique: true },
  password: { type: String, required: true },
  animeLists: {
    watching: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Anime' }],
    completed: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Anime' }],
    favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Anime' }],
    planToWatch: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Anime' }]
  },
  friends: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);
