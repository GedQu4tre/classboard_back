// horaireController.js

const { Horaire } = require('../models/Horaire');
const { Classe } = require('../models/Classe');
const { Personnel } = require('../models/Personnel');

// Create a new horaire
exports.createHoraire = async (req, res) => {
  try {
    const { classe, emploiDuTemps } = req.body;

    // Vérifier que la classe existe
    const classeExistante = await Classe.findById(classe);
    if (!classeExistante) {
      return res.status(404).json({ message: 'Classe not found' });
    }

    // Vérifier que les professeurs existent
    const professeurs = await Promise.all(
      emploiDuTemps.map(async (creneau) => {
        const professeur = await Personnel.findById(creneau.professeur);
        if (!professeur) {
          throw new Error(`Professeur ${creneau.professeur} not found`);
        }
        return professeur;
      })
    );

    const newHoraire = new Horaire({ classe, emploiDuTemps });
    await newHoraire.save();
    res.status(201).json(newHoraire);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Get all horaires
exports.getHoraires = async (req, res) => {
  try {
    const horaires = await Horaire.find().populate('classe').populate('emploiDuTemps.professeur');
    res.json(horaires);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get a single horaire
exports.getHoraire = async (req, res) => {
  try {
    const horaire = await Horaire.findById(req.params.id)
      .populate('classe')
      .populate('emploiDuTemps.professeur');
    if (!horaire) {
      return res.status(404).json({ message: 'Horaire not found' });
    }
    res.json(horaire);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update a horaire
exports.updateHoraire = async (req, res) => {
  try {
    const { classe, emploiDuTemps } = req.body;

    // Vérifier que la classe existe
    const classeExistante = await Classe.findById(classe);
    if (!classeExistante) {
      return res.status(404).json({ message: 'Classe not found' });
    }

    // Vérifier que les professeurs existent
    const professeurs = await Promise.all(
      emploiDuTemps.map(async (creneau) => {
        const professeur = await Personnel.findById(creneau.professeur);
        if (!professeur) {
          throw new Error(`Professeur ${creneau.professeur} not found`);
        }
        return professeur;
      })
    );

    const updatedHoraire = await Horaire.findByIdAndUpdate(
      req.params.id,
      { classe, emploiDuTemps },
      { new: true }
    );
    if (!updatedHoraire) {
      return res.status(404).json({ message: 'Horaire not found' });
    }
    res.json(updatedHoraire);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Delete a horaire
exports.deleteHoraire = async (req, res) => {
  try {
    const deletedHoraire = await Horaire.findByIdAndDelete(req.params.id);
    if (!deletedHoraire) {
      return res.status(404).json({ message: 'Horaire not found' });
    }
    res.json({ message: 'Horaire deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};