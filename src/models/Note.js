const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  classe: { type: mongoose.Schema.Types.ObjectId, ref: 'Classe', required: true },
  notes: [
    {
      matiere: { type: String, required: true },
      note: { type: Number, min: 0, max: 20, required: true },
      date: { type: Date, required: true }
    }
  ]
});

const Note = mongoose.model('Note', noteSchema);
module.exports = {Note};