/*

* API Gamepad

* Serveur

*/

//! Import de express + création du serveur + import de mongoose + import de fileIupload
const express = require("express");
const path = require("path");
const app = express();

// Middleware pour servir les fichiers statiques
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const mongoose = require("mongoose");

//! Import et de cors - Cross-origin resource sharing
const cors = require("cors");
app.use(cors());

const fileUpload = require("express-fileupload");

// Permettre au serveur de récupérer des body
app.use(express.json());

//Permet d'activer les variables d'environnement
require("dotenv").config();

//* <--- BDD --->

// Connexion à la BDD
mongoose.connect(process.env.MONGODB_URI);

//* <--- SERVEUR --->

//* SERVICE : HOME
app.get("/", (req, res) => {
  res.json({ message: "Bienvenue sur Gamepad" });
});

//* IMPORT ET UTILISATION DES AUTRES SERVICES
//Route User
const userRouter = require("./routes/user");
app.use(userRouter);

//Route Bookmark
const bookmarkRouter = require("./routes/bookmark");
app.use(bookmarkRouter);

//Route Review
const reviewRouter = require("./routes/review");
app.use(reviewRouter);

//* SERVICE : ROUTE POUBELLE
app.all("*", (req, res) => {
  res.status(404).json({ message: "Route introuvable" });
});

//* ECOUTE DU SERVEUR
app.listen(process.env.PORT, () => {
  console.log("Server started 🕹️");
});

//* <--- FIN SERVEUR --->
