const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();

const userRoutes = require("./routes/userRoutes");
const appointmentRoutes = require("./routes/appointmentRoutes");

const app = express();

// Middleware
app.use(express.json());
app.use(cors()); // Permet les requêtes cross-origin

// Connexion à MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('Connecté à la base de données MongoDB');
  })
  .catch(err => {
    console.log('Erreur de connexion à la base de données', err);
  });

// Routes
app.use("/users", userRoutes);
app.use("/appointments", appointmentRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log('Serveur à lécoute sur le port ' + PORT);
});