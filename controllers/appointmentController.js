const Appointment = require("../models/appointment");

// Ajouter un rendez-vous
exports.createAppointment = async (req, res) => {
  try {
    let { date } = req.body;

    // Vérifier si la date est au format JJ/MM/AAA
    // Vérifier si la date est au format JJ/MM/AAAA
if (typeof date === 'string' && date.match(/^\d{2}\/\d{2}\/\d{4}$/)) {
  const [day, month, year] = date.split('/');
  
  const dayNum = parseInt(day, 10);
  const monthNum = parseInt(month, 10);
  const fullYear = parseInt(year, 10);
  
  if (dayNum < 1 || dayNum > 31 || monthNum < 1 || monthNum > 12) {
    return res.status(400).json({ error: "Valeurs de jour ou mois invalides" });
  }
  
  // Créer une date valide (mois en JavaScript est 0-indexé)
  const dateObj = new Date(fullYear, monthNum - 1, dayNum, 12, 0, 0);

  // Vérifier si la date est correcte et pas dans le passé
  if (dateObj.getDate() !== dayNum || dateObj.getMonth() !== monthNum - 1 || dateObj < new Date()) {
    return res.status(400).json({ error: "Date invalide ou dans le passé" });
  }

  req.body.date = dateObj;
}

    
    
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
    const appointments = await Appointment.find();    
    res.status(200).json(appointments);
  } catch (error) {
    console.error("Erreur lors de la récupération des rendez-vous :", error);
    res.status(500).json({ message: "Erreur lors de la récupération des rendez-vous" });
  }
};
//Obtenir tous les rendez-vous dans le calendrier
exports.getCalendarEvents = async (req, res) => {
  try {
    let filter = {}; // Définition du filtre par défaut (admin voit tout)

    // Vérifier le rôle de l'utilisateur connecté
    if (req.user.role === "professionnel") {
      filter = { professionnel: req.user.id }; // Filtrer par ID du professionnel
    } else if (req.user.role === "client") {
      filter = { client: req.user.id }; // Filtrer par ID du client
    } 
    // L'admin voit tout donc pas de filtre spécifique

    const appointments = await Appointment.find(filter);

    if (!appointments || appointments.length === 0) {
      return res.status(404).json({ message: "Aucun rendez-vous trouvé" });
    }

    const events = appointments.map(appt => {
      if (!appt || !appt.statut || !appt.date || !appt.service || !appt.animal) {
        console.warn("Données invalides pour un rendez-vous :", appt);
        return null;
      }
    
      return {
        id: appt._id,
        title: `RDV - ${appt.service} (${appt.animal})`,
        start: appt.date,
        backgroundColor: appt.statut === "confirmé" ? "#28a745" : appt.statut === "annulé" ? "#dc3545" : "#ffc107",
        borderColor: "#000"
      };
    }).filter(event => event !== null);

    res.json(events);
  } catch (error) {
    console.error("Erreur lors de la récupération des rendez-vous :", error);
    res.status(500).json({ message: "Erreur lors de la récupération des rendez-vous" });
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