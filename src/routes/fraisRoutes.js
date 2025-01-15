const express = require('express');
const router = express.Router();
const fraisController = require('../controllers/fraisController');

// Routes pour les frais
router.get('/:ecole', fraisController.getAllFrais);
router.get('/:id', fraisController.getFraisById);
router.post('/create', fraisController.createFrais);
router.put('/update/:id', fraisController.updateFrais);
router.delete('/delete/:id', fraisController.deleteFrais);

// Routes pour les paiements
router.get('/grillePaiement/:studentId', fraisController.getFraisWithPaymentStatus)
router.post('/confirmPaiement', fraisController.confirmPaiement)

module.exports = router;