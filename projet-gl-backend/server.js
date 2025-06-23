// Charge les variables d'environnement depuis le fichier .env
const dotenv = require('dotenv');
dotenv.config();

// Importe les modules nécessaires
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

// Se connecte à la base de données MongoDB
connectDB();

// Initialise l'application Express
const app = express();

// --- Middlewares ---
// Active CORS pour autoriser les requêtes depuis d'autres domaines (notre front-end React)
app.use(cors());
// Permet à Express de parser le JSON entrant dans les corps de requête
app.use(express.json());
// Permet à Express de parser les données de formulaire URL-encodées
app.use(express.urlencoded({ extended: false }));


// --- Routes ---
// Route de test pour vérifier que le serveur fonctionne
app.get('/', (req, res) => {
  res.send('API du Projet GL est en cours de fonctionnement...');
});

// (Nous ajouterons les routes pour les individus ici plus tard)
// app.use('/api/individuals', require('./routes/individualRoutes'));


// --- Démarrage du serveur ---
// Récupère le port depuis les variables d'environnement, avec 5000 comme valeur par défaut
const PORT = process.env.PORT || 5000;

// Met le serveur en écoute sur le port spécifié
app.listen(PORT, () => console.log(`Serveur démarré sur le port ${PORT}`));
