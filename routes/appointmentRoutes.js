const express = require("express");
const { 
    createAppointment, 
    getAppointments, 
    getAppointmentById, 
    updateAppointment, 
    deleteAppointment 
} = require("../controllers/appointmentController");
const authenticate = require("../middleware/authenticate");
const authorize = require("../middleware/authorize");

const router = express.Router();

/**
 * @swagger
 * /appointments:
 *   post:
 *     summary: Créer un nouveau rendez-vous (pour client uniquement)
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
router.post("/", authenticate, authorize(['client','admin','professionnel']), createAppointment);

/**
 * @swagger
 * /appointments:
 *   get:
 *     summary: Récupérer tous les rendez-vous (admin uniquement)
 *     tags: [Appointments]
 *     responses:
 *       200:
 *         description: Liste des rendez-vous
 *       500:
 *         description: Erreur serveur
 */
router.get("/", authenticate, authorize(['admin']), getAppointments);

/**
 * @swagger
 * /appointments/{id}:
 *   get:
 *     summary: Récupérer un rendez-vous par ID (tout utilisateur ayant le droit d'accès)
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
router.get("/:id", authenticate, getAppointmentById);

/**
 * @swagger
 * /appointments/{id}:
 *   put:
 *     summary: Mettre à jour un rendez-vous (admin ou professionnel uniquement)
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
router.put("/:id", authenticate, authorize(['admin', 'professionnel'], true), updateAppointment);

/**
 * @swagger
 * /appointments/{id}:
 *   delete:
 *     summary: Supprimer un rendez-vous (admin uniquement)
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
router.delete("/:id", authenticate, authorize(['admin'], true), deleteAppointment);

module.exports = router;
