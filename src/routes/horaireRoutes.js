// horaireRoutes.js

const express = require('express');
const router = express.Router();
const horaireController = require('../controllers/horaireController');

router.post('/horaires/create', horaireController.createHoraire);
router.get('/horaires', horaireController.getHoraires);
router.get('/horaires/:id', horaireController.getHoraire);
router.patch('/horaires/:id/update', horaireController.updateHoraire);
router.delete('/horaires/:id/delete', horaireController.deleteHoraire);

module.exports = router;