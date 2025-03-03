const express = require("express");
const { 
    createAvailability, 
    getAvailabilities, 
    getAvailabilityById, 
    updateAvailability, 
    deleteAvailability 
} = require("../controllers/availabilityController");

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
 *     summary: Ajouter une disponibilité
 *     tags: [Availabilities]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               professionnel:
 *                 type: string
 *                 description: ID du professionnel
 *               date:
 *                 type: string
 *                 format: date
 *                 description: Date de la disponibilité (AAAA-MM-JJ)
 *               heureDebut:
 *                 type: string
 *                 description: Heure de début (HH:mm)
 *               heureFin:
 *                 type: string
 *                 description: Heure de fin (HH:mm)
 *     responses:
 *       201:
 *         description: Disponibilité créée avec succès
 *       400:
 *         description: Erreur de validation
 */
router.post("/", createAvailability);

/**
 * @swagger
 * /availabilities:
 *   get:
 *     summary: Récupérer toutes les disponibilités
 *     tags: [Availabilities]
 *     responses:
 *       200:
 *         description: Liste des disponibilités
 *       500:
 *         description: Erreur serveur
 */
router.get("/", getAvailabilities);

/**
 * @swagger
 * /availabilities/{id}:
 *   get:
 *     summary: Récupérer une disponibilité par ID
 *     tags: [Availabilities]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la disponibilité
 *     responses:
 *       200:
 *         description: Disponibilité trouvée
 *       404:
 *         description: Disponibilité non trouvée
 *       500:
 *         description: Erreur serveur
 */
router.get("/:id", getAvailabilityById);

/**
 * @swagger
 * /availabilities/{id}:
 *   put:
 *     summary: Mettre à jour une disponibilité
 *     tags: [Availabilities]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la disponibilité
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               date:
 *                 type: string
 *                 format: date
 *               heureDebut:
 *                 type: string
 *               heureFin:
 *                 type: string
 *     responses:
 *       200:
 *         description: Disponibilité mise à jour
 *       404:
 *         description: Disponibilité non trouvée
 *       500:
 *         description: Erreur serveur
 */
router.put("/:id", updateAvailability);

/**
 * @swagger
 * /availabilities/{id}:
 *   delete:
 *     summary: Supprimer une disponibilité
 *     tags: [Availabilities]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la disponibilité
 *     responses:
 *       200:
 *         description: Disponibilité supprimée
 *       404:
 *         description: Disponibilité non trouvée
 *       500:
 *         description: Erreur serveur
 */
router.delete("/:id", deleteAvailability);

module.exports = router;