const {Personnel} = require('../models/Personnel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

// Générer un token JWT
const generateToken = (id, ecole) => {
  return jwt.sign({ id, ecole }, process.env.JWT_SECRET, { expiresIn: '1d' });
};

// Inscription
exports.register = async (req, res) => {
  try {
    const { nom, email, username, password, droits, ecole } = req.body;

    const existingUser = await Personnel.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ error: 'Un utilisateur avec cet email existe déjà.' });
    }

    const personnel = new Personnel({ nom, email, username, password, droits, ecole });
    await personnel.save();

    res.status(201).json({ message: 'Personnel enregistré avec succès.', personnel });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de l\'inscription.', details: error.message });
  }
};

// Connexion
exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    const personnel = await Personnel.findOne({ username });

    if (!personnel) {
      return res.status(404).json({ error: 'Utilisateur non trouvé.' });
    }

    const isMatch = await personnel.comparePassword(password);

    if (!isMatch) {
      return res.status(401).json({ error: 'Mot de passe incorrect.' });
    }

    const token = generateToken(personnel._id, personnel.ecole);

    res.status(200).json({
      message: 'Connexion réussie.',
      token,
      user: {
        id: personnel._id,
        nom: personnel.nom,
        email: personnel.email,
        username: personnel.username,
        droits: personnel.droits,
        ecole: personnel.ecole
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la connexion.', details: error.message });
  }
};

// Mise à jour d'un personnel
exports.updatePersonnel = async (req, res) => {
  try {
    const { id } = req.params;
    const { nom, email, droits } = req.body;

    const updatedPersonnel = await Personnel.findByIdAndUpdate(
      id,
      { nom, email, droits },
      { new: true }
    );

    if (!updatedPersonnel) {
      return res.status(404).json({ error: 'Personnel non trouvé.' });
    }

    res.status(200).json({ message: 'Personnel mis à jour avec succès.', updatedPersonnel });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la mise à jour.', details: error.message });
  }
};

// Suppression d'un personnel
exports.deletePersonnel = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedPersonnel = await Personnel.findByIdAndDelete(id);

    if (!deletedPersonnel) {
      return res.status(404).json({ error: 'Personnel non trouvé.' });
    }

    res.status(200).json({ message: 'Personnel supprimé avec succès.' });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la suppression.', details: error.message });
  }
};

// Liste des personnels d'une école
exports.getPersonnelBySchool = async (req, res) => {
  try {
    const { ecoleId } = req.params;

    const personnels = await Personnel.find({ ecole: ecoleId });

    res.status(200).json({ personnels });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération des personnels.', details: error.message });
  }
};

// Récupération d'un personnel spécifique
exports.getPersonnelById = async (req, res) => {
  try {
    const { id } = req.params;

    const personnel = await Personnel.findById(id);

    if (!personnel) {
      return res.status(404).json({ error: 'Personnel non trouvé.' });
    }

    res.status(200).json({ personnel });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération.', details: error.message });
  }
};
