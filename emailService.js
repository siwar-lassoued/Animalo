const nodemailer = require('nodemailer');
require('dotenv').config(); // Charger les variables d'environnement

const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false,
    requireTLS: true, // Force le TLS
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    },
    tls: {
        rejectUnauthorized: false
    }
});


async function sendEmail(to, subject, text) {
    try {
        let info = await transporter.sendMail({
            from: `"Animalo" <${process.env.EMAIL_USER}>`,
            to,
            subject,
            text
        });
        console.log("E-mail envoyé: " + info.messageId);
    } catch (error) {
        console.error("Erreur lors de l'envoi de l'e-mail:", error);
    }
}

module.exports = { sendEmail };
