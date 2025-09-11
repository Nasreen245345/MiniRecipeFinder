const mongoose = require("mongoose");

const favouriteSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true,
  },
  idMeal: {
    type: String,
    index: true,
    required: true,
  },
  strMeal: {
    type: String,
    index: true,
    required: true,
  },
  strMealThumb: {
      type: String 
  },
  strCategory: {
    type: String,
    index: true,
    required: true,
  },
  strArea: {
    type: String,
    index: true,
    required: true,
  },
  ingredients: {
    type: [String], 
    default: [],
  },
  instructions: {
    type: String, 
  },
  createdAt: {
    type: Date,
    default: Date.now,
    index: true,
  },
});

// Prevent duplicate favourites for same user + meal
favouriteSchema.index({ userId: 1, idMeal: 1 }, { unique: true });

module.exports = mongoose.model("Favourites", favouriteSchema);
