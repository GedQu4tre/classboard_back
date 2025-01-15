const express = require('express');
const router = express.Router();
const personnelController = require('../controllers/personnelController');
const { protect } = require('../middleware/authMiddleware');

// Routes pour l'authentification
router.post('/register', personnelController.register);
router.post('/login', personnelController.login);

// Routes pour les personnels
router.post('/personnels', protect, personnelController.register);
router.get('/personnels', protect, personnelController.getPersonnelBySchool);
router.get('/personnels/:id', protect, personnelController.getPersonnelById);
router.put('/personnels/:id', protect, personnelController.updatePersonnel);
router.delete('/personnels/:id', protect, personnelController.deletePersonnel);

// Routes pour les droits
// router.post('/permissions', protect, personnelController.createDroit);
// router.get('/permissions', protect, personnelController.getDroits);
// router.get('/permissions/:id', protect, personnelController.getDroit);
// router.put('/permissions/:id', protect, personnelController.updateDroit);
// router.delete('/permissions/:id', protect, personnelController.deleteDroit);

module.exports = router;
