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
        // Vérifier si l'utilisateur est admin ou s'il met à jour son propre profil
        if (req.user.rôle !== 'admin' && req.user._id !== id) {
            return res.status(403).json({ message: "Accès refusé : vous ne pouvez voir que votre propre profil" });
        }
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
  
        
        // Vérifier si l'utilisateur est admin ou s'il met à jour son propre profil
        if (req.user.rôle !== 'admin' && req.user._id !== id) {
            return res.status(403).json({ message: "Accès refusé : vous ne pouvez modifier que votre propre profil" });
        }
  
        // Seul un admin peut modifier le rôle d'un utilisateur
        if (rôle && req.user.rôle !== 'admin') {
            return res.status(403).json({ message: "Accès refusé : seul un admin peut modifier le rôle d'un utilisateur" });
        }
  
        // Hasher le mot de passe si fourni
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
  
  // Supprimer un utilisateur (seul un admin peut le faire)
  exports.deleteUser = async (req, res) => {
      try {
          const { id } = req.params;
  
          // Seul un admin peut supprimer un utilisateur
          if (req.user.rôle !== 'admin') {
              return res.status(403).json({ message: "Accès refusé : seuls les administrateurs peuvent supprimer un utilisateur" });
          }
  
          await User.findByIdAndDelete(id);
          res.send("Utilisateur supprimé avec succès");
      } catch (error) {
          res.status(400).send(error.message);
      }
  };
  