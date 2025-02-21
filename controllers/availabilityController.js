const Availability = require("../models/Availability");

//Ajouter une disponibilité
exports.createAvailability = async (req, res) => {
  try {
    const availability = new Availability(req.body);
    await availability.save();
    res.status(201).json(availability);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

//Obtenir toutes les disponibilités
exports.getAvailabilities = async (req, res) => {
  try {
    const availabilities = await Availability.find();
    res.json(availabilities);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//Obtenir une disponibilité spécifique
exports.getAvailabilityById = async (req, res) => {
  try {
    const availability = await Availability.findById(req.params.id);
    if (!availability) return res.status(404).json({ message: "Disponibilité non trouvée" });
    res.json(availability);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//Mettre à jour une disponibilité
exports.updateAvailability = async (req, res) => {
  try {
    const availability = await Availability.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!availability) return res.status(404).json({ message: "Disponibilité non trouvée" });
    res.json(availability);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//Supprimer une disponibilité
exports.deleteAvailability = async (req, res) => {
  try {
    const availability = await Availability.findByIdAndDelete(req.params.id);
    if (!availability) return res.status(404).json({ message: "Disponibilité non trouvée" });
    res.json({ message: "Disponibilité supprimée" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
