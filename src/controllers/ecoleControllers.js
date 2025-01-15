const { Ecole } = require('../models/Ecole');
const {Personnel, Permission} = require('../models/Personnel')
const bcrypt = require('bcrypt')

// 1. Créer une école
exports.creerEcole = async (req, res) => {
  try {
    const { nom, adresse, abonnement, administrateur } = req.body;

    // Créez l'école
    const nouvelleEcole = new Ecole({
      nom,
      adresse,
      abonnement: {
        type: abonnement.type || 'gratuit',
        dateExpiration: abonnement.dateExpiration || null
      }
    });

    await nouvelleEcole.save();

    // Créez l'administrateur si les informations sont fournies
    if (administrateur) {
      // Récupérer toutes les permissions sauf pour les écoles
      const permissions = await Permission.find({ entite: { $ne: 'écoles' } });

      // Hacher le mot de passe de l'administrateur
      // const hashedPassword = await bcrypt.hash(administrateur.password, 10);

      // Créer l'administrateur
      const newAdmin = new Personnel({
        nom: administrateur.nom,
        username: administrateur.username,
        password: administrateur.password, // Le mot de passe sera haché par le middleware
        typeAccount: 'admin',
        ecole: nouvelleEcole._id,
        permissions // Ajoutez les permissions récupérées
      });

      await newAdmin.save();
    }

    res.status(201).json({ success: true, message: 'École et administrateur créés avec succès', ecole: nouvelleEcole });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Erreur lors de la création de l\'école', details: error.message });
  }
};

// 2. Obtenir toutes les écoles
exports.listeEcoles = async (req, res) => {
  try {
    const ecoles = await Ecole.find().lean();

    const result = await Promise.all(
      ecoles.map(async (ecole) => {
        // Récupérer l'administrateur de l'école
        const administrateur = await Personnel.findOne({
          ecole: ecole._id,
          typeAccount: 'admin',
        });

        // Récupérer le nombre de personnels associés à l'école
        const totalPersonnels = await Personnel.countDocuments({ ecole: ecole._id });

        // Ajouter les informations supplémentaires
        return {
          ...ecole,
          administrateur: administrateur || null, // Sécurisation au cas où il manquerait un admin
          totalPersonnels,
        };
      })
    );

    res.status(200).json({ success: true, ecoles: result });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Erreur lors de la récupération des écoles', details: error.message });
  }
};



// 3. Obtenir une école par ID
exports.obtenirEcoleParId = async (req, res) => {
  try {
    const { id } = req.params;
    const ecole = await Ecole.findById(id).populate('personnels');

    if (!ecole) {
      return res.status(404).json({success: false, error: 'École non trouvée' });
    }

    res.status(200).json({success: true, ecole: ecole});
  } catch (error) {
    res.status(500).json({ success: false, error: 'Erreur lors de la récupération de l\'école', details: error.message });
  }
};

// 4. Mettre à jour une école
exports.mettreAJourEcole = async (req, res) => {
  try {
    const { id } = req.params;
    const { nom, adresse, abonnement } = req.body;

    const ecole = await Ecole.findByIdAndUpdate(
      id,
      { nom, adresse, abonnement },
      { new: true, runValidators: true }
    );

    if (!ecole) {
      return res.status(404).json({ success: false, error: 'École non trouvée' });
    }

    res.status(200).json({ success: true, message: 'École mise à jour avec succès', ecole });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Erreur lors de la mise à jour de l\'école', details: error.message });
  }
};

// 5. Supprimer une école
exports.supprimerEcole = async (req, res) => {
  try {
    const { id } = req.params;

    const ecole = await Ecole.findByIdAndDelete(id);

    if (!ecole) {
      return res.status(404).json({ success: false, error: 'École non trouvée' });
    }

    res.status(200).json({ success: true, message: 'École supprimée avec succès' });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Erreur lors de la suppression de l\'école', details: error.message });
  }
};

// 6. Mettre à jour l'abonnement d'une école
exports.mettreAJourAbonnement = async (req, res) => {
  try {
    const { id } = req.params;
    const { type, dateExpiration } = req.body;

    const ecole = await Ecole.findById(id);

    if (!ecole) {
      return res.status(404).json({ success: false, error: 'École non trouvée' });
    }

    ecole.abonnement.type = type;
    ecole.abonnement.dateExpiration = dateExpiration;

    await ecole.save();

    res.status(200).json({ success: true, message: 'Abonnement mis à jour avec succès', abonnement: ecole.abonnement });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Erreur lors de la mise à jour de l\'abonnement', details: error.message });
  }
};
