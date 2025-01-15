const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  nom: { type: String, required: true },
  dateNaissance: { type: Date, required: true },
  sexe: { type: String, enum: ['Masculin', 'Féminin'], required: true },
  adresse: {type: String, required: true},
  contacts: [
    {
      nom: { type: String, required: true },
      relation: { type: String, required: true },
      telephone: { type: String, required: true },
    }
  ],
  classe: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Classe',
    required: true
  },
  option: {
    type: String,
    required: true
  },
  ecole: {type: mongoose.Schema.Types.ObjectId, ref: 'Ecole', required: true}
});

const Student = mongoose.model('Student', studentSchema);

module.exports = {Student};