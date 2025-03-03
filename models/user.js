const mongoose = require('mongoose');
const bcrypt = require('bcryptjs'); 

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

userSchema.pre('save', async function(next){
    const user = this;
    if(user.isModified('motDePasse')){
        user.motDePasse = await bcrypt.hash(user.motDePasse,10)
    }
    next();
});

module.exports = mongoose.model('User', userSchema);

