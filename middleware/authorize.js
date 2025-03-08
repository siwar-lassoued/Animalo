const Appointment = require('../models/appointment');

const authorize = (roles, isOwnerCheck = false, entityType = null) => {
    return (req, res, next) => {
        const { rôle, _id } = req.user; // récupéré depuis le token

        // Vérification si le rôle de l'utilisateur fait partie des rôles autorisés
        if (roles.includes(rôle)) {
            return next();
        }

        // Vérification spécifique au propriétaire d'un rendez-vous
        if (isOwnerCheck && entityType === 'appointment') {
            const appointmentId = req.params.id;
            Appointment.findById(appointmentId)
                .then(appointment => {
                    if (!appointment) {
                        return res.status(404).json({ message: "Rendez-vous non trouvé" });
                    }
                    if (rôle === 'client' && String(appointment.client) !== String(_id)) {
                        return res.status(403).json({ message: "Vous n'êtes pas le client de ce rendez-vous." });
                    }
                    if (rôle === 'professionnel' && String(appointment.professionnel) !== String(_id)) {
                        return res.status(403).json({ message: "Vous n'êtes pas le professionnel de ce rendez-vous." });
                    }
                    next();
                })
                .catch(err => res.status(500).json({ message: "Erreur serveur" }));
            return;
        }

        // Vérification pour un utilisateur voulant voir/modifier son propre profil
        if (isOwnerCheck && entityType === 'user' && req.params.id === String(_id)) {
            return next();
        }

        return res.status(403).json({ message: "Accès interdit" });
    };
};

module.exports = authorize;
