const mongoose = require('mongoose');

const fraisSchema = new mongoose.Schema({
  nom: {type: String, required: true},
  montant: { type: Number, required: true },
  date_limite: { type: Date, required: true },
  description: { type: String },
  classes: [Object],
  ecole: {type: mongoose.Schema.Types.ObjectId, ref: 'Ecole', required: true}
});


const paiementSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student', // Référence au modèle 'Student'
    required: true,
  },
  frais: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Frais', // Référence au modèle 'Frais'
    required: true,
  },
  datePaiement: {
    type: Date,
    default: Date.now, // Date de paiement par défaut à la date actuelle
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Personnel', // Référence au modèle 'User'
  },
});

// Exportation du modèle
const Paiement = mongoose.model('Paiement', paiementSchema);

const Frais = mongoose.model('Frais', fraisSchema);

module.exports = {Frais, Paiement};