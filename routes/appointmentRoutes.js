const express = require("express");
const { 
    createAppointment, 
    getAppointments, 
    getAppointmentById, 
    updateAppointment, 
    deleteAppointment, 
    getCalendarEvents,
    cancelAppointment
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
router.post("/", authenticate, authorize(['client','admin']), createAppointment);

/**
 * @swagger
 * /appointments:
 *   get:
 *     summary: Récupérer tous les rendez-vous (admin uniquement)
 *     tags: [Appointments]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des rendez-vous
 *       500:
 *         description: Erreur serveur
 */
router.get("/", authenticate, authorize(['admin','client','professionnel']),getAppointments);

// /**
//  * @swagger
//  * /appointments/calendar-events:
//  *   get:
//  *     summary: Récupérer les rendez-vous formatés pour FullCalendar
//  *     tags: [Appointments]
//  *     security:
//  *       - bearerAuth: []
//  *     responses:
//  *       200:
//  *         description: Liste des rendez-vous au format FullCalendar
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: array
//  *               items:
//  *                 type: object
//  *                 properties:
//  *                   id:
//  *                     type: string
//  *                     description: ID du rendez-vous
//  *                   title:
//  *                     type: string
//  *                     description: Titre du rendez-vous (nom du service)
//  *                   start:
//  *                     type: string
//  *                     format: date-time
//  *                     description: Date et heure de début du rendez-vous
//  *                   end:
//  *                     type: string
//  *                     format: date-time
//  *                     description: Date et heure de fin du rendez-vous
//  *                   client:
//  *                     type: string
//  *                     description: ID du client ayant pris le rendez-vous
//  *                   professionnel:
//  *                     type: string
//  *                     description: ID du professionnel concerné
//  *       401:
//  *         description: Non autorisé (token manquant ou invalide)
//  *       500:
//  *         description: Erreur serveur
//  */
router.get("/calendar-events", authenticate,authorize(['admin','professionnel']), getCalendarEvents);

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
router.get("/:id", authenticate,authorize(['admin', 'professionnel', 'client']), getAppointmentById);

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

/**
 * @swagger
 * /appointments/{id}/cancel:
 *   put:
 *     summary: Annuler un rendez-vous (admin, professionnel ou client autorisé)
 *     tags: [Appointments]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID du rendez-vous à annuler
 *     responses:
 *       200:
 *         description: Rendez-vous annulé avec succès
 *       403:
 *         description: Accès non autorisé
 *       404:
 *         description: Rendez-vous non trouvé
 *       500:
 *         description: Erreur serveur
 */

router.put("/:id/cancel", authenticate, authorize(['admin', 'professionnel', 'client']), cancelAppointment);

module.exports = router;
