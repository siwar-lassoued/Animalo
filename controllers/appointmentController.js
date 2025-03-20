const Appointment = require("../models/appointment");
const { sendEmail } = require('../emailService');
const moment = require("moment");
const User = require ('../models/user')

exports.createAppointment = async (req, res) => {
  try {
    let { date } = req.body;

    if (typeof date === "string" && moment(date, "DD/MM/YYYY", true).isValid()) {
      const dateObj = moment(date, "DD/MM/YYYY").toDate(); 
    
      if (moment(dateObj).isBefore(moment().startOf("day"))) {
        return res.status(400).json({ error: "Date invalide ou dans le passé" });
      }
    
      if (moment(dateObj).day() === 0) {
        return res.status(400).json({ error: "Les rendez-vous ne sont pas disponibles le dimanche" });
      }
    
      if (moment(dateObj).isAfter(moment().add(6, "months"))) {
        return res.status(400).json({ error: "Les rendez-vous ne peuvent pas être réservés à plus de 6 mois" });
      }
    
      req.body.date = dateObj;
    } else {
      return res.status(400).json({ error: "Format de date invalide, utilisez JJ/MM/AAAA" });
    }

    const appointment = new Appointment(req.body);
    await appointment.save();

    // Récupérer les emails du client et du professionnel
    const clientUser = await User.findById(appointment.client);
    const professionalUser = await User.findById(appointment.professionnel);

    if (clientUser && professionalUser) {
      // Envoyer un e-mail de confirmation au client
      sendEmail(
        clientUser.email,
        "Confirmation de votre rendez-vous",
        `Bonjour ${clientUser.nom}, votre rendez-vous pour ${appointment.service} avec ${professionalUser.nom} le ${new Date(appointment.date).toLocaleString()} a bien été enregistré.`
      );

      // Envoyer un e-mail de notification au professionnel
      sendEmail(
        professionalUser.email,
        "Nouveau rendez-vous",
        `Bonjour ${professionalUser.nom}, un rendez-vous pour ${appointment.service} avec ${clientUser.nom} a été pris pour le ${new Date(appointment.date).toLocaleString()}.`
      );
    }

    res.status(201).json(appointment);
  } catch (error) {
    console.error("Erreur lors de la création du rendez-vous :", error);
    res.status(500).json({ error: "Erreur interne du serveur" });
  }
};

// Modifier un rendez-vous
exports.updateAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findByIdAndUpdate(req.params.id, req.body, { new: true });

    if (!appointment) {
      return res.status(404).json({ message: "Rendez-vous non trouvé" });
    }

    // Récupérer les emails du client et du professionnel
    const clientUser = await User.findById(appointment.client);
    const professionalUser = await User.findById(appointment.professionnel);

    if (clientUser && professionalUser) {
      // Envoyer un e-mail au client
      sendEmail(
        clientUser.email,
        "Mise à jour de votre rendez-vous",
        `Bonjour ${clientUser.nom}, votre rendez-vous pour ${appointment.service} avec ${professionalUser.nom} a été mis à jour. Nouvelle date : ${new Date(appointment.date).toLocaleString()}.`
      );

      // Envoyer un e-mail au professionnel
      sendEmail(
        professionalUser.email,
        "Un rendez-vous a été modifié",
        `Bonjour ${professionalUser.nom}, le rendez-vous avec ${clientUser.nom} pour ${appointment.service} a été mis à jour. Nouvelle date : ${new Date(appointment.date).toLocaleString()}.`
      );
    }

    res.json(appointment);
  } catch (error) {
    console.error("Erreur lors de la modification du rendez-vous :", error);
    res.status(500).json({ error: error.message });
  }
};

// Annuler un rendez-vous
exports.cancelAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    const appointment = await Appointment.findById(id);

    if (!appointment) {
      return res.status(404).json({ message: "Rendez-vous non trouvé" });
    }

    appointment.statut = "annulé";
    await appointment.save();

    // Récupérer les emails du client et du professionnel
    const clientUser = await User.findById(appointment.client);
    const professionalUser = await User.findById(appointment.professionnel);

    if (clientUser && professionalUser) {
      // Envoyer un e-mail d’annulation au client
      sendEmail(
        clientUser.email,
        "Annulation de votre rendez-vous",
        `Bonjour ${clientUser.nom}, votre rendez-vous pour ${appointment.service} avec ${professionalUser.nom} le ${new Date(appointment.date).toLocaleString()} a été annulé.`
      );

      // Envoyer un e-mail d’annulation au professionnel
      sendEmail(
        professionalUser.email,
        "Un rendez-vous a été annulé",
        `Bonjour ${professionalUser.nom}, le rendez-vous pour ${appointment.service} avec ${clientUser.nom} prévu le ${new Date(appointment.date).toLocaleString()} a été annulé.`
      );
    }

    res.json({ message: "Rendez-vous annulé avec succès" });
  } catch (error) {
    console.error("Erreur lors de l'annulation du rendez-vous :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};
// Tester l'envoi d'un email
exports.testEmail = async (req, res) => {
  try {
    const { email, subject, message } = req.body;

    if (!email || !subject || !message) {
      return res.status(400).json({ error: "Email, sujet et message sont requis." });
    }

    // Envoyer l'email de test
    await sendEmail(email, subject, message);

    res.status(200).json({ message: "E-mail de test envoyé avec succès" });
  } catch (error) {
    console.error("Erreur lors de l'envoi de l'e-mail de test :", error);
    res.status(500).json({ error: "Erreur lors de l'envoi de l'e-mail de test." });
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

    const events = appointments
  .map(appt => {
    if (!appt || !appt.statut || !appt.date || !appt.service || !appt.animal) {
      console.warn("Rendez-vous ignoré pour données invalides :", appt?._id);
      return null;
    }
    return {
      id: appt._id,
      title: `RDV - ${appt.service} (${appt.animal})`,
      start: appt.date,
      backgroundColor: appt.statut === "confirmé" ? "#28a745" :
                      appt.statut === "annulé" ? "#dc3545" : "#ffc107",
      borderColor: "#000"
    };
  })
  .filter(event => event !== null);


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


// Supprimer un rendez-vous
exports.deleteAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findByIdAndDelete(req.params.id);
    appointment ? res.json({ message: "Rendez-vous supprimé" }) : res.status(404).json({ message: "Rendez-vous non trouvé" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};