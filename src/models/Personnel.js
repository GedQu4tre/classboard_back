const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// Schéma des permissions
const permissionSchema = new mongoose.Schema({
  entite: { type: String, required: true, enum: ['frais', 'élèves', 'personnels', 'points', 'cours', 'classes', 'écoles', 'horaires'] },
  actions: [{ type: String, enum: ['lecture', 'écriture', 'suppression'], required: true }]
});

// Schéma de base pour les personnels
const personnelSchema = new mongoose.Schema({
  nom: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  typeAccount: { type: String, required: true, enum: ['staff', 'admin', 'superadmin',] },
  permissions: [permissionSchema], 
  ecole: { type: mongoose.Schema.Types.ObjectId, ref: 'Ecole', required: true },
}, {
  timestamps: true,
});

// Middleware pour hacher le mot de passe avant de sauvegarder
personnelSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

// Méthode pour vérifier le mot de passe
personnelSchema.methods.comparePassword = async function (password) {
  return bcrypt.compare(password, this.password);
};



const Personnel = mongoose.model('Personnel', personnelSchema);
const Permission = mongoose.model('Permission', permissionSchema);

module.exports = { Personnel, Permission };
