// classesController.js

const { Classe, Option } = require('../models/Classe');

// Create a new class
exports.createClasse = async (req, res) => {
  try {
    const { niveau, options } = req.body;
    const newClasse = new Classe({ niveau, options });
    await newClasse.save();
    res.status(201).json(newClasse);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Get all classes
exports.getClasses = async (req, res) => {
  try {
    const classes = await Classe.find();
    res.json(classes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get a single class
exports.getClasse = async (req, res) => {
  try {
    const classe = await Classe.findById(req.params.id);
    if (!classe) {
      return res.status(404).json({ message: 'Classe introuvable !' });
    }
    res.json(classe);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update a class
exports.updateClasse = async (req, res) => {
  try {
    const { niveau, options } = req.body;
    const updatedClasse = await Classe.findByIdAndUpdate(
      req.params.id,
      { niveau, options },
      { new: true }
    );
    if (!updatedClasse) {
      return res.status(404).json({ message: 'Classe introuvable' });
    }
    res.json(updatedClasse);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Delete a class
exports.deleteClasse = async (req, res) => {
  try {
    const deletedClasse = await Classe.findByIdAndDelete(req.params.id);
    if (!deletedClasse) {
      return res.status(404).json({ message: 'Classe introuvable' });
    }
    res.json({ message: 'Classe supprimé avec succès !' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POUR LES OPTIONS

// Récupérer toutes les options
exports.getOptions = async (req, res) => {
  try {
    const options = await Option.find();
    res.status(200).json(options);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Créer une nouvelle option
exports.createOption = async (req, res) => {
  const option = new Option({
    nom: req.body.nom
  });

  try {
    const newOption = await option.save();
    res.status(201).json(newOption);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Mettre à jour une option
exports.updateOption = async (req, res) => {
  try {
    const option = await Option.findById(req.params.id);
    if (!option) {
      return res.status(404).json({ message: 'Impossible de trouver l\'option' });
    }

    option.nom = req.body.nom;
    const updatedOption = await option.save();
    res.status(200).json(updatedOption);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Supprimer une option
exports.deleteOption = async (req, res) => {
  try {
    const option = await Option.findById(req.params.id);
    if (!option) {
      return res.status(404).json({ message: 'Impossible de trouver l\'option' });
    }

    await option.remove();
    res.status(200).json({ message: 'Option supprimée avec succès' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};