const {Frais, Paiement} = require('../models/Frais');
const { Student } = require('../models/Student');
const { Personnel } = require('../models/Personnel');
const bcrypt = require('bcrypt')

// Ce qui concerne les frais

exports.getAllFrais = async (req, res) => {
  const { ecole } = req.params;

  try {
    const frais = await Frais.find({ ecole: ecole });
    const paiements = await Paiement.find();
    const eleves = await Student.find({ ecole: ecole });

    const fraisWithElevesCount = frais.map(fraisItem => {
      const classesWithElevesCount = fraisItem.classes.map(classeItem => {
        const { _id, niveau, nom_options = [] } = classeItem;

        const elevesInClasse = eleves.filter(eleve => {
          return (
            eleve.classe &&
            eleve.classe.toString() === _id.toString() &&
            nom_options.includes(eleve.option || '')
          );
        });

        const eleveIdsInClasse = elevesInClasse.map(eleve => eleve._id.toString());

        const elevesAyantPaye = paiements.filter(paiement => 
          paiement.frais &&
          paiement.frais.toString() === fraisItem._id.toString() &&
          paiement.eleve &&
          eleveIdsInClasse.includes(paiement.eleve.toString())
        );

        return {
          id: _id,
          niveau: niveau,
          nom_options: nom_options,
          totalEleves: elevesInClasse.length,
          elevesAyantPaye: elevesAyantPaye.length
        };
      });

      return {
        id: fraisItem._id,
        nom: fraisItem.nom,
        description: fraisItem.description,
        montant: fraisItem.montant,
        classes: classesWithElevesCount,
        date_limite: fraisItem.date_limite
      };
    });

    res.json(fraisWithElevesCount);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


exports.getFraisById = async (req, res) => {
  try {
    const frais = await Frais.findById(req.params.id).populate('user');
    if (!frais) {
      return res.status(404).json({ message: 'Frais not found' });
    }
    res.status(200).json(frais);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createFrais = async (req, res) => {
  const frais = new Frais({
    montant: req.body.montant,
    date_limite: req.body.date_limite,
    description: req.body.description,
    classes: req.body.classes,
    nom: req.body.nom,
    ecole: req.body.ecole
  });

  try {
    const newFrais = await frais.save();
    res.status(201).json(newFrais);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.updateFrais = async (req, res) => {
  try {
    const frais = await Frais.findById(req.params.id);
    if (!frais) {
      return res.status(404).json({ message: 'Frais not found' });
    }

    frais.montant = req.body.montant;
    frais.date = req.body.date;
    frais.description = req.body.description;
    frais.categorie = req.body.categorie;
    frais.user = req.body.user;

    const updatedFrais = await frais.save();
    res.status(200).json(updatedFrais);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.deleteFrais = async (req, res) => {
  try {
    const frais = await Frais.findById(req.params.id);
    if (!frais) {
      return res.status(404).json({ message: 'Frais not found' });
    }
    await frais.remove();
    res.status(204).json({ message: 'Frais deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Récupérer le paiement qui concerne l'élève
exports.getFraisWithPaymentStatus = async (req, res) => {
  try {
    const eleveId = req.params.studentId;

    // Récupérer l'élève
    const eleve = await Student.findById(eleveId, 'classe option ecole').lean();
    if (!eleve) {
      return res.status(404).json({ message: "Étudiant non trouvé" });
    }

    const { classe, option, ecole } = eleve;

    if (!classe || !option) {
      return res.status(400).json({ message: "Classe ou option non définie pour cet élève" });
    }

    // Récupérer les paiements
    const paiements = await Paiement.find({ student: eleveId }, 'frais user datePaiement')
      .populate({ path: 'user', select: 'nom' })
      .lean();

    const paiementMap = new Map(
      paiements.map(paiement => [paiement.frais.toString(), paiement])
    );

    // Récupérer les frais
    const frais = await Frais.find(
      { ecole },
      '_id nom date_limite description montant classes'
    ).lean();

    // Filtrer et mapper les frais
    const fraisWithPaymentStatus = frais
      .filter(fraisItem => 
        fraisItem.classes.some(classeItem => 
          classeItem &&
          classeItem._id &&
          classeItem._id.toString() === classe.toString() &&
          classeItem.nom_options &&
          classeItem.nom_options.includes(option)
        )
      )
      .map(fraisItem => {
        const paiement = paiementMap.get(fraisItem._id.toString());
        return {
          _id: fraisItem._id,
          nom: fraisItem.nom,
          date_limite: fraisItem.date_limite,
          datePaiement: paiement ? paiement.datePaiement : null,
          description: fraisItem.description,
          montant: fraisItem.montant,
          paid: Boolean(paiement),
          paiementId: paiement ? paiement._id : null,
          personnel: paiement && paiement.user ? paiement.user.nom : null,
        };
      });

    res.json(fraisWithPaymentStatus);
  } catch (err) {
    console.error("Erreur :", err);
    res.status(500).json({ message: "Erreur lors de la récupération des frais", error: err.message });
  }
};




// Enregistrer un nouveau paiement
exports.confirmPaiement = async (req, res) => {

  const user = await Personnel.findById(req.body.user);

  const passwordMatched = await user.comparePassword(req.body.userPassword);

  if (passwordMatched) {
    const paiement = new Paiement({
      frais: req.body.frais,
      student: req.body.student,
      user: req.body.user,
      datePaiement: req.body.datePaiement
    });
  
    try {
      const newPaiement = await paiement.save();
      res.status(201).json(newPaiement);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  } else {
    res.status(401).json({message: "Le mot de passe ne correspond pas !"})
  }
}
