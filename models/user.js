const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    nom: { 
        type: String, 
        required: true 
    },
    email: { 
        type: String, 
        required: true, 
        unique: true 
    },
    motDePasse: { 
        type: String, 
        required: true 
    },
    rôle: { 
        type: String, 
        enum: ['admin', 'client', 'professionnel'], 
        default: "client",
        required: true 
    }
});

module.exports = mongoose.model('User', userSchema);

