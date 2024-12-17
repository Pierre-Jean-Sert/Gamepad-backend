/*

* API Gamepad

* Modèle Bookmark

*/

// Import de mongoose
const mongoose = require("mongoose");

//Modèle d'un user
const Bookmark = mongoose.model("Bookmark", {
  gameId: String,
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

module.exports = Bookmark;
