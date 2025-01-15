const jwt = require('jsonwebtoken');
const Pesronnel = require('../models/Personnel'); // Mongoose model pour l'utilisateur

// Middleware pour protéger les routes
exports.protect = async (req, res, next) => {
  let token;

  // Vérification si le token est dans le header Authorization
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Extraire le token de l'Authorization header
      token = req.headers.authorization.split(' ')[1];

      // Vérifier et décoder le token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Trouver l'utilisateur en fonction du token
      req.user = await Pesronnel.findById(decoded.id).select('-password'); // Exclut le mot de passe de l'utilisateur

      next(); // Passe au middleware suivant ou à la route
    } catch (error) {
      res.status(401).json({ message: 'Unauthorized, token failed' });
    }
  } else {
    res.status(401).json({ message: 'No token, authorization denied' });
  }
};
