// Importe le modèle Individual que nous avons défini
const Individual = require('../models/Individual');
const mongoose = require('mongoose');

/**
 * @desc    Créer un nouvel individu
 * @route   POST /api/individuals
 * @access  Public (pour l'instant)
 */
const createIndividual = async (req, res) => {
    try {
        const { firstName, lastName, gender, birth, death } = req.body;
        if (!firstName) {
            return res.status(400).json({ message: 'Le prénom est un champ obligatoire.' });
        }
        const ownerId = "user_placeholder_id"; 
        const treeId = req.body.treeId || new mongoose.Types.ObjectId(); 

        const newIndividual = new Individual({
            ownerId, treeId, firstName, lastName, gender, birth, death
        });

        const savedIndividual = await newIndividual.save();
        res.status(201).json(savedIndividual);
    } catch (error) {
        res.status(400).json({ message: 'Erreur lors de la création de l\'individu', error: error.message });
    }
};

/**
 * @desc    Récupérer tous les individus d'un arbre spécifique
 * @route   GET /api/individuals/:treeId
 * @access  Public (pour l'instant)
 */
const getIndividualsByTreeId = async (req, res) => {
    try {
        const { treeId } = req.params;
        if (!mongoose.Types.ObjectId.isValid(treeId)) {
            return res.status(400).json({ message: 'L\'ID de l\'arbre fourni est invalide.' });
        }
        const individuals = await Individual.find({ treeId: treeId });
        res.status(200).json(individuals);
    } catch (error) {
        res.status(500).json({ message: 'Erreur du serveur lors de la récupération des données.', error: error.message });
    }
};

/**
 * @desc    Mettre à jour un individu spécifique
 * @route   PUT /api/individuals/:id
 * @access  Public (pour l'instant)
 */
const updateIndividual = async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'L\'ID de l\'individu fourni est invalide.' });
        }

        const updatedIndividual = await Individual.findByIdAndUpdate(
            id, 
            req.body, 
            { new: true, runValidators: true } // 'new: true' renvoie le document mis à jour
        );

        if (!updatedIndividual) {
            return res.status(404).json({ message: 'Aucun individu trouvé avec cet ID.' });
        }

        res.status(200).json(updatedIndividual);
    } catch (error) {
        res.status(500).json({ message: 'Erreur du serveur lors de la mise à jour.', error: error.message });
    }
};

/**
 * @desc    Supprimer un individu spécifique
 * @route   DELETE /api/individuals/:id
 * @access  Public (pour l'instant)
 */
const deleteIndividual = async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'L\'ID de l\'individu fourni est invalide.' });
        }

        const individual = await Individual.findByIdAndDelete(id);

        if (!individual) {
            return res.status(404).json({ message: 'Aucun individu trouvé avec cet ID.' });
        }

        res.status(200).json({ message: 'Individu supprimé avec succès.', id: id });
    } catch (error) {
        res.status(500).json({ message: 'Erreur du serveur lors de la suppression.', error: error.message });
    }
};


// Exporte toutes les fonctions du contrôleur
module.exports = {
    createIndividual,
    getIndividualsByTreeId,
    updateIndividual,
    deleteIndividual
};
