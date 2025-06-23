// Importe Mongoose, l'outil pour interagir avec MongoDB
const mongoose = require('mongoose');

/**
 * Fonction asynchrone pour se connecter à la base de données MongoDB.
 * Utilise l'URI stockée dans les variables d'environnement.
 */
const connectDB = async () => {
  try {
    // Tente de se connecter à la base de données avec l'URI fournie
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    // Si la connexion réussit, affiche un message dans la console
    console.log(`MongoDB Connecté: ${conn.connection.host}`);
  } catch (error) {
    // Si une erreur survient, affiche l'erreur et arrête le processus
    console.error(`Erreur de connexion à la DB: ${error.message}`);
    process.exit(1); // Quitte l'application avec un code d'erreur
  }
};

// Exporte la fonction pour qu'elle puisse être utilisée dans d'autres fichiers
module.exports = connectDB;
