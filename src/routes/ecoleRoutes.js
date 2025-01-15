const express = require('express');
const router = express.Router();
const ecoleController = require('../controllers/ecoleControllers')

// Routes pour les écoles
router.post('/create', ecoleController.creerEcole); // Créer une école
router.get('/', ecoleController.listeEcoles); // Obtenir toutes les écoles
router.get('/ecoles/:id', ecoleController.obtenirEcoleParId); // Obtenir une école par ID
router.put('/ecoles/:id', ecoleController.mettreAJourEcole); // Mettre à jour une école
router.delete('/ecoles/:id', ecoleController.supprimerEcole); // Supprimer une école
router.patch('/ecoles/:id/abonnement', ecoleController.mettreAJourAbonnement); // Mettre à jour l'abonnement

module.exports = router;
