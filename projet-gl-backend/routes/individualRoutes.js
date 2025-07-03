const express = require('express');
const router = express.Router();

const { 
    createInitialTree, // Nom mis à jour
    createIndividual,
    getIndividualsByTreeId,
    getIndividualById,
    updateIndividual,
    deleteIndividual,
    deleteTree
} = require('../controllers/individualController');

// --- ROUTES POUR LES ARBRES ---
router.post('/create-tree', createInitialTree); // Utilise la nouvelle fonction
router.delete('/tree/:treeId', deleteTree);

// --- ROUTES POUR LES INDIVIDUS ---
router.post('/', createIndividual);
router.get('/tree/:treeId', getIndividualsByTreeId);
router.get('/person/:id', getIndividualById);
router.put('/:id', updateIndividual);
router.delete('/:id', deleteIndividual);

module.exports = router;
