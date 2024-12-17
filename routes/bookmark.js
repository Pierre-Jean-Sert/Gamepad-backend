/*

* API Gamepad

* Router Bookmark

*/

//! Import de express + fonction router d'express
const express = require("express");
const router = express.Router();

//! Import du modele Bookmark
const Bookmark = require("../models/Bookmark");

//! Import des middlewares
const isAuthenticated = require("../middlewares/isAuthenticated");

//* SERVICE : CREER UN NOUVEAU BOOKMARK
//
router.post("/bookmark/add", isAuthenticated, async (req, res) => {
  try {
    //
    // Destructuring de req
    const { gameId } = req.body;

    // Récupération de l'user id
    const userId = req.user._id;

    // Vérifie que le bookmark n'existe pas déjà
    const bookmarkAlreadyInBase = await Bookmark.findOne({
      gameId: gameId,
      owner: userId,
    });

    if (bookmarkAlreadyInBase) {
      return res
        .status(400)
        .json({ message: "Bookmark already in base for this user" });
    }

    // Création d'un nouveau bookmark
    const newBookmark = new Bookmark({
      gameId: gameId,
      owner: userId,
    });

    // Enregistrement du bookmark
    await newBookmark.save();

    // Retour au client
    res.status(201).json(newBookmark);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//* SERVICE : RECUPERER LES BOOKMARKS D'UN USER
//
router.get("/bookmark/", isAuthenticated, async (req, res) => {
  try {
    //

    // Récupération de l'user id
    const userId = req.user._id;

    // Récupération de tous les bookmarks
    const bookmarks = await Bookmark.find({ owner: userId });

    // Retour au client
    res.status(200).json(bookmarks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//Export des routes
module.exports = router;
