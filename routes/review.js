/*

* API Gamepad

* Router Review

*/

//! Import de express + fonction router d'express
const express = require("express");
const router = express.Router();

//! Import du modele Review
const Review = require("../models/Review");

//! Import des middlewares
const isAuthenticated = require("../middlewares/isAuthenticated");

//* SERVICE : CREER UNE NOUVELLE REVIEW
//
router.post("/review/add", isAuthenticated, async (req, res) => {
  try {
    //
    // Destructuring de req
    const { gameId, text, title } = req.body;

    // Récupération de l'user id
    const userId = req.user._id;

    // Vérifie que l'utilisateur n'a pas déjà posté de review
    const reviewAlreadyInBase = await Review.findOne({
      gameId: gameId,
      owner: userId,
    });

    if (reviewAlreadyInBase) {
      return res
        .status(400)
        .json({ message: "Review already in base for this user" });
    }

    // Création d'une nouvelle review
    const newReview = new Review({
      gameId: gameId,
      title: title,
      text: text,
      owner: userId,
    });

    // Enregistrement de la review
    await newReview.save();

    // Retour au client
    res.status(201).json(newReview);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//* SERVICE : RECUPERER TOUTES LES REVIEWS
//
router.get("/review", async (req, res) => {
  try {
    //
    // Destructuring de req
    const { gameId } = req.query;

    // Récupération des reviews
    const reviews = await Review.find({
      gameId: gameId,
    }).populate({ path: "owner", select: "account" });

    // Retour au client
    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//Export des routes
module.exports = router;
