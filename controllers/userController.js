const User = require("../models/user.js");
const authenticate = require("../middleware/authenticate");
const bcrypt = require('bcryptjs')
// Obtenir tous les utilisateurs
exports.getUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.send(users);
    } catch (error) {
        res.status(500).send("Erreur serveur");
    }
};

// Obtenir un utilisateur par ID
exports.getUserById = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id);
        user ? res.send(user) : res.status(404).json({ message: "Utilisateur non trouvé" });
    } catch (error) {
        res.status(400).send(error.message);
    }
};

// Mettre à jour un utilisateur 
exports.updateUser = async (req, res) => {
  try {
      const { id } = req.params;
      let { nom, email, motDePasse, rôle } = req.body;

      // Vérifier si un mot de passe est fourni et le hasher
      if (motDePasse) {
          motDePasse = await bcrypt.hash(motDePasse, 10);
      }

      const updatedUser = await User.findByIdAndUpdate(
          id,
          { nom, email, motDePasse, rôle },
          { new: true }
      );

      updatedUser
          ? res.send({ message: "Utilisateur mis à jour avec succès", user: updatedUser })
          : res.status(404).json({ message: "Utilisateur non trouvé" });

  } catch (error) {
      res.status(400).send(error.message);
  }
};

// Supprimer un utilisateur 
exports.deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        await User.findByIdAndDelete(id);
        res.send("Utilisateur supprimé avec succès");
    } catch (error) {
        res.status(400).send(error.message);
    }
};
