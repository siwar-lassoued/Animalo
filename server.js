const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const swaggerUI = require('swagger-ui-express');
const swaggerSpec = require('./swagger');

dotenv.config();

const userRoutes = require("./routes/userRoutes");
const appointmentRoutes = require("./routes/appointmentRoutes");
const availabilityRoutes = require("./routes/availabilityRoutes");
const authRoutes = require('./routes/auth');

const app = express();

// Serve Swagger documentation
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerSpec));

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
app.use('/auth', authRoutes);
app.use("/users", userRoutes);
app.use("/appointments", appointmentRoutes);
app.use("/availabilities", availabilityRoutes);


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log('Serveur à lécoute sur le port ' + PORT);
  console.log("Swagger docs available at http://localhost:7000/api-docs");

});