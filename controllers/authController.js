const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

exports.register = async (req, res) => {
    try {
        const { nom, email, motDePasse, rôle } = req.body;

        // Vérifier si l'utilisateur existe déjà
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: "L'utilisateur existe déjà" });
        }

        

        const user = new User({ 
            nom, 
            email, 
            motDePasse, 
            rôle 
        });

        await user.save();

        // Générer le token JWT après l'inscription
        const token = jwt.sign(
            { _id: user._id, rôle: user.rôle },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.status(201).json({ 
            message: "Utilisateur enregistré avec succès",
            token, // Retourne le JWT
            rôle: user.rôle
        });

    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, motDePasse } = req.body;

        // Rechercher l'utilisateur par email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "Utilisateur non trouvé" });
        }

        // Vérifier le mot de passe sans double hashage
        const isPasswordMatch = await bcrypt.compare(motDePasse, user.motDePasse);
        if (!isPasswordMatch) {
            return res.status(401).json({ message: "Mot de passe incorrect" });
        }

        // Générer un token JWT
        const token = jwt.sign(
            { _id: user._id, rôle: user.rôle },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.json({ token, rôle: user.rôle });

    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
