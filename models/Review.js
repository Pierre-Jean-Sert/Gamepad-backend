/*

* API Gamepad

* Modèle Review

*/

// Import de mongoose
const mongoose = require("mongoose");

//Modèle d'une review
const Review = mongoose.model("Review", {
  gameId: String,
  title: String,
  text: String,
  counter: {
    type: Number,
    default: 0,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

module.exports = Review;
