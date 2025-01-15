const mongoose = require('mongoose');

const horaireSchema = new mongoose.Schema({
  classe: { type: mongoose.Schema.Types.ObjectId, ref: 'Classe', required: true },
  emploiDuTemps: [
    {
      jour: { type: String, enum: ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'], required: true },
      creneau: { type: String, required: true },
      matiere: { type: String, required: true },
      professeur: { type: mongoose.Schema.Types.ObjectId, ref: 'Personnel', required: true }
    }
  ]
});

const Horaire = mongoose.model('Horaire', horaireSchema);

module.exports = {Horaire};