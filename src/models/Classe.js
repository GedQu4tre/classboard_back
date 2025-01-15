  const mongoose = require('mongoose');

  const optionSchema = new mongoose.Schema({
    nom: {
      type: String,
      required: true
    }
  });

const classeSchema = new mongoose.Schema({
    niveau: {
      type: String,
      required: true,
      unique: true
    },
    options: [optionSchema]
});


  const Classe = mongoose.model('Classe', classeSchema);
  const Option = mongoose.model('Option', optionSchema)

  module.exports = {Classe, Option};