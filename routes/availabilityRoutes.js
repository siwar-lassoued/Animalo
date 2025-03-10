const express = require("express");
const { 
    createAvailability, 
    getAvailabilities, 
    getAvailabilityById, 
    updateAvailability, 
    deleteAvailability 
} = require("../controllers/availabilityController");
const authorize = require('../middleware/authorize'); 
const authenticate = require("../middleware/authenticate");

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Availabilities
 *   description: Gestion des disponibilités des professionnels
 */

/**
 * @swagger
 * /availabilities:
 *   post:
 *     summary: Ajouter une disponibilité (admin et professionnel)
 *     tags: [Availabilities]
 *     security:
 *       - bearerAuth: [] 
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               professionnel:
 *                 type: string
 *                 description: L'ID du professionnel
 *               date:
 *                 type: string
 *                 description: La date de la disponibilité
 *               heureDebut:
 *                 type: string
 *                 description: L'heure de début de la disponibilité
 *               heureFin:
 *                 type: string
 *                 description: L'heure de fin de la disponibilité
 *     responses:
 *       201:
 *         description: Disponibilité ajoutée avec succès
 *       400:
 *         description: Erreur de validation ou d'enregistrement
 */
router.post("/", authenticate, authorize(['admin', 'professionnel']), createAvailability);

/**
 * @swagger
 * /availabilities:
 *   get:
 *     summary: Récupérer toutes les disponibilités (admin uniquement)
 *     tags: [Availabilities]
 *     security:
 *       - bearerAuth: [] 
 *     responses:
 *       200:
 *         description: Liste des disponibilités récupérée avec succès
 *       500:
 *         description: Erreur serveur
 */
router.get("/", authenticate, authorize(['admin']), getAvailabilities);

/**
 * @swagger
 * /availabilities/{id}:
 *   get:
 *     summary: Récupérer une disponibilité spécifique (admin et professionnel)
 *     tags: [Availabilities]
 *     security:
 *       - bearerAuth: []  
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID de la disponibilité
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Disponibilité trouvée
 *       404:
 *         description: Disponibilité non trouvée
 *       500:
 *         description: Erreur serveur
 */
router.get("/:id", authenticate, authorize(['admin', 'professionnel'], true), getAvailabilityById);

/**
 * @swagger
 * /availabilities/{id}:
 *   put:
 *     summary: Mettre à jour une disponibilité (admin ou professionnel uniquement sur ses propres disponibilités)
 *     tags: [Availabilities]
 *     security:
 *       - bearerAuth: []  
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID de la disponibilité
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               date:
 *                 type: string
 *                 description: La date de la disponibilité
 *               heureDebut:
 *                 type: string
 *                 description: L'heure de début de la disponibilité
 *               heureFin:
 *                 type: string
 *                 description: L'heure de fin de la disponibilité
 *     responses:
 *       200:
 *         description: Disponibilité mise à jour avec succès
 *       400:
 *         description: Erreur de validation ou mise à jour
 *       404:
 *         description: Disponibilité non trouvée
 */
router.put("/:id", authenticate, authorize(['admin', 'professionnel'], true), updateAvailability);

/**
 * @swagger
 * /availabilities/{id}:
 *   delete:
 *     summary: Supprimer une disponibilité (admin ou professionnel uniquement sur ses propres disponibilités)
 *     tags: [Availabilities]
 *     security:
 *       - bearerAuth: []  
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID de la disponibilité
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Disponibilité supprimée avec succès
 *       404:
 *         description: Disponibilité non trouvée
 */
router.delete("/:id", authenticate, authorize(['admin', 'professionnel'], true), deleteAvailability);

module.exports = router;
