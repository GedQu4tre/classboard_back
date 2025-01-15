const mongoose = require('mongoose');

// Schéma pour les écoles
const ecoleSchema = new mongoose.Schema({
    nom: { type: String, required: true },
    adresse: { type: String },
    abonnement: {
      type: { type: String, required: true, enum: ['gratuit', 'standard', 'premium'], default: 'gratuit' },
      dateExpiration: { type: Date }
    },
    personnels: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Personnel' }]
});

const Ecole = mongoose.model('Ecole', ecoleSchema);

module.exports = {Ecole};
  