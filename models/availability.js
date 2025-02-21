const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    professionnel : {
        type:mongoose.Schema.Types.ObjectId,
        ref:"User", 
        required: true
    },
    date : {
        type: String,
        required: true
    },
    heureDebut: { 
        type: String, 
        required: true 
    }, 
    heureFin: { type: String, 
        required: true 
    }
})

module.exports = mongoose.model('Availability', userSchema);
