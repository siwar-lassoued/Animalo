const User = require("../models/user.js");

// Ajouter un utilisateur
exports.createUser = async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Obtenir tous les utilisateurs
exports.getUsers = async (req, res) => {
  const users = await User.find();
  res.json(users);
};

// Obtenir un utilisateur par ID
exports.getUserById = async (req, res) => {
  const user = await User.findById(req.params.id);
  user ? res.json(user) : res.status(404).json({ message: "Utilisateur non trouvé" });
};

// MAJ un utilisateur
exports.updateUser = async (req, res) => {
  const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
  user ? res.json(user) : res.status(404).json({ message: "Utilisateur non trouvé" });
};

// Supprimer un utilisateur
exports.deleteUser = async (req, res) => {
  const user = await User.findByIdAndDelete(req.params.id);
  user ? res.json({ message: "Utilisateur supprimé" }) : res.status(404).json({ message: "Utilisateur non trouvé" });
};
