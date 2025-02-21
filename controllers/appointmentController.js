const Appointment = require("../models/Appointment.js");

// Ajouter un rendez-vous
exports.createAppointment = async (req, res) => {
  try {
    const appointment = new Appointment(req.body);
    await appointment.save();
    res.status(201).json(appointment);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Obtenir tous les rendez-vous
exports.getAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find().populate("client professionnel", "nom email");
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Obtenir un rendez-vous par ID
exports.getAppointmentById = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id).populate("client professionnel", "nom email");
    appointment ? res.json(appointment) : res.status(404).json({ message: "Rendez-vous non trouvé" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Mettre à jour un rendez-vous
exports.updateAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findByIdAndUpdate(req.params.id, req.body, { new: true });
    appointment ? res.json(appointment) : res.status(404).json({ message: "Rendez-vous non trouvé" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Supprimer un rendez-vous
exports.deleteAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findByIdAndDelete(req.params.id);
    appointment ? res.json({ message: "Rendez-vous supprimé" }) : res.status(404).json({ message: "Rendez-vous non trouvé" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};