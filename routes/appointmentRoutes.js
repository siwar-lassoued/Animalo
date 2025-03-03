const express = require("express");
const { 
    createAppointment, 
    getAppointments, 
    getAppointmentById, 
    updateAppointment, 
    deleteAppointment 
} = require("../controllers/appointmentController");

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Appointments
 *   description: Gestion des rendez-vous
 */

/**
 * @swagger
 * /appointments:
 *   post:
 *     summary: Créer un nouveau rendez-vous
 *     tags: [Appointments]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - client
 *               - professionnel
 *               - animal
 *               - date
 *               - service
 *             properties:
 *               client:
 *                 type: string
 *                 description: ID du client
 *               professionnel:
 *                 type: string
 *                 description: ID du professionnel
 *               animal:
 *                 type: string
 *                 description: Type d'animal
 *               race:
 *                 type: string
 *                 description: Race de l'animal (optionnel)
 *               date:
 *                 type: string
 *                 format: date-time
 *               service:
 *                 type: string
 *                 enum: [bain, tonte, soins, complet]
 *               statut:
 *                 type: string
 *                 enum: [confirmé, annulé, en attente]
 *                 default: en attente
 *               commentaire:
 *                 type: string
 *     responses:
 *       201:
 *         description: Rendez-vous créé avec succès
 *       400:
 *         description: Erreur de validation des données
 */
router.post("/", createAppointment);

/**
 * @swagger
 * /appointments:
 *   get:
 *     summary: Récupérer tous les rendez-vous
 *     tags: [Appointments]
 *     responses:
 *       200:
 *         description: Liste des rendez-vous
 *       500:
 *         description: Erreur serveur
 */
router.get("/", getAppointments);

/**
 * @swagger
 * /appointments/{id}:
 *   get:
 *     summary: Récupérer un rendez-vous par ID
 *     tags: [Appointments]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID du rendez-vous
 *     responses:
 *       200:
 *         description: Rendez-vous trouvé
 *       404:
 *         description: Rendez-vous non trouvé
 */
router.get("/:id", getAppointmentById);

/**
 * @swagger
 * /appointments/{id}:
 *   put:
 *     summary: Mettre à jour un rendez-vous
 *     tags: [Appointments]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID du rendez-vous à mettre à jour
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               client:
 *                 type: string
 *               professionnel:
 *                 type: string
 *               animal:
 *                 type: string
 *               race:
 *                 type: string
 *               date:
 *                 type: string
 *                 format: date-time
 *               service:
 *                 type: string
 *                 enum: [bain, tonte, soins, complet]
 *               statut:
 *                 type: string
 *                 enum: [confirmé, annulé, en attente]
 *               commentaire:
 *                 type: string
 *     responses:
 *       200:
 *         description: Rendez-vous mis à jour
 *       404:
 *         description: Rendez-vous non trouvé
 */
router.put("/:id", updateAppointment);

/**
 * @swagger
 * /appointments/{id}:
 *   delete:
 *     summary: Supprimer un rendez-vous
 *     tags: [Appointments]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID du rendez-vous à supprimer
 *     responses:
 *       200:
 *         description: Rendez-vous supprimé
 *       404:
 *         description: Rendez-vous non trouvé
 */
router.delete("/:id", deleteAppointment);

module.exports = router