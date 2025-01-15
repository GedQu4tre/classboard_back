// classesRoutes.js

const express = require('express');
const router = express.Router();
const classeController = require('../controllers/classeController.js');

router.post('/createClasse', classeController.createClasse);
router.get('/getClasses', classeController.getClasses);
router.get('/getClasse/:id', classeController.getClasse);
router.patch('/updateClasse/:id', classeController.updateClasse);
router.delete('/deleteClasse/:id', classeController.deleteClasse);


// Récupérer toutes les options
router.get('/options', classeController.getOptions);

// Créer une nouvelle option
router.post('/createOption', classeController.createOption);

// Mettre à jour une option
router.patch('/optionUpdate/:id', classeController.updateOption);

// Supprimer une option
router.delete('optionDelete/:id', classeController.deleteOption);


module.exports = router;