const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Initialiser l'application Express
const app = express();

// Configurez les options CORS
app.use(cors());

// Charger les variables d'environnement
dotenv.config();

// Importer les routes
const studentRoutes = require('./src/routes/studentRoutes.js');
const classeRoutes = require('./src/routes/classeRoutes.js')
const personnelRoutes = require('./src/routes/personnelRoutes.js');
const horaireRoutes = require('./src/routes/horaireRoutes.js');
const noteRoutes = require('./src/routes/noteRoutes.js');
const fraisRoutes = require('./src/routes/fraisRoutes.js');

const schoolRoutes = require('./src/routes/ecoleRoutes')

// Connexion à la base de données MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Connexion à MongoDB réussie'))
.catch((err) => console.error('Erreur de connexion à MongoDB :', err));

// Middlewares
app.use(express.json());

// Routes
app.use('/student', studentRoutes);
app.use('/classe', classeRoutes)
app.use('/horaire', horaireRoutes);
app.use('/personnel', personnelRoutes);
app.use('/notes', noteRoutes);
app.use('/frais', fraisRoutes);
app.use('/school', schoolRoutes)

// Lancement du serveur
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});