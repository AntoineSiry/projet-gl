// Importe Express pour créer le routeur
const express = require('express');
const router = express.Router();

// Importe les fonctions du contrôleur
const { 
    createIndividual,
    getIndividualsByTreeId,
    updateIndividual,
    deleteIndividual
} = require('../controllers/individualController');

// Définit la route pour créer un individu.
// POST /api/individuals
router.post('/', createIndividual);

// Définit la route pour récupérer tous les individus d'un arbre.
// GET /api/individuals/:treeId
router.get('/:treeId', getIndividualsByTreeId);

// Définit la route pour mettre à jour un individu par son ID unique.
// PUT /api/individuals/:id
router.put('/:id', updateIndividual);

// Définit la route pour supprimer un individu par son ID unique.
// DELETE /api/individuals/:id
router.delete('/:id', deleteIndividual);

// Exporte le routeur pour l'utiliser dans server.js
module.exports = router;
