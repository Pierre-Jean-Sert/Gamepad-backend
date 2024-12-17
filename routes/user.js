/*

* API Gamepad

* Router User

*/

//! Import de express + fonction router d'express
const express = require("express");
const router = express.Router();

//! Fileupload
const fileUpload = require("express-fileupload");
const path = require("path");
const fs = require("fs");

//! Import du modele User
const User = require("../models/User");

//! Import des packages d'encodage du mot de passe
const SHA256 = require("crypto-js/sha256");
const encBase64 = require("crypto-js/enc-base64");
const uid2 = require("uid2");

//
//* SERVICE : ENREGISTRER UN NOUVEL UTILISATEUR
//
router.post("/signup", fileUpload(), async (req, res) => {
  try {
    //

    //Vérification que tous les champs ont été renseignés
    if (!req.body.username || !req.body.email || !req.body.password) {
      return res.status(400).json({
        message: "One or more fields are empty",
      });
    }

    //Vérification que l'email n'est pas déjà enregistré en base
    const existingUser = await User.findOne({ email: req.body.email });

    if (existingUser) {
      return res.status(400).json({
        message: "This email already has an account",
      });
    }

    //Encodage du mot de passe
    const password = req.body.password;
    const salt = uid2(16);
    const hash = SHA256(password + salt).toString(encBase64);
    const token = uid2(16);

    // Gestion de l'avatar
    let avatarPath = null;
    if (req.files && req.files.file) {
      const file = req.files.file;

      // Créer un chemin unique pour l'image
      const uniqueFileName = `${uid2(16)}-${file.name}`;
      const uploadPath = path.join(
        __dirname,
        "../uploads/avatars",
        uniqueFileName
      );

      // Déplacer l'image dans le dossier
      await file.mv(uploadPath);

      // Enregistrer le chemin de l'image
      avatarPath = `/uploads/avatars/${uniqueFileName}`;
    }

    //Creation de l'utilisateur
    const newUser = new User({
      email: req.body.email,
      account: {
        username: req.body.username,
        avatar: avatarPath,
      },
      newsletter: req.body.newsletter,
      token: token,
      hash: hash,
      salt: salt,
    });

    //Enregistrement de l'utilisateur
    await newUser.save();

    //Réponse au client
    res.status(201).json({
      id: newUser._id,
      token: newUser.token,
      account: newUser.account,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//
//* SERVICE : SE CONNECTER
//
router.post("/login", async (req, res) => {
  //

  const user = await User.findOne({ email: req.body.email });

  //Vérification que l'utilisateur est déjà enregistré
  if (!user) {
    return res.status(400).json({
      message: "Incorrect email address or password",
    });
  }

  //Récupération des données de l'utilisateur en base
  const userSalt = user.salt;
  const userHash = user.hash;

  //Encodage du mot de passe envoyé
  const postPassword = req.body.password;
  const postHash = SHA256(postPassword + userSalt).toString(encBase64);

  //Réponse au client
  if (userHash === postHash) {
    res.status(202).json({
      _id: user._id,
      token: user.token,
      account: user.account,
    });
  } else {
    res
      .status(401)
      .json({ message: "L'adresse email ou le mot est incorrect" });
  }
});

//Export des routes
module.exports = router;
