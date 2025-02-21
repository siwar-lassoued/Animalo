const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
    client: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    professionnel: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    animal: { 
        type: String, 
        required: true 
    },
    race: { 
        type: String 
    },
    date: { 
        type: Date, 
        required: true 
    },
    service: { 
        type: String, 
        enum: ['bain', 'tonte', 'soins', 'complet'], 
        required: true 
    },
    statut: { 
        type: String, 
        enum: ['confirmé', 'annulé', 'en attente'], 
        default: 'en attente' 
    },
    commentaire: { 
        type: String 
    }
}, { timestamps: true });

module.exports = mongoose.model('Appointment', appointmentSchema);
