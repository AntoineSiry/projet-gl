const Individual = require('../models/Individual');
const mongoose = require('mongoose');

/**
 * @desc    Créer un arbre initial avec 1 enfant et 2 parents
 * @route   POST /api/individuals/create-tree
 * @access  Public
 */
const createInitialTree = async (req, res) => {
    try {
        const ownerId = "user_placeholder_id";
        const treeId = new mongoose.Types.ObjectId();

        // On prépare les 3 individus à créer
        const individualsToCreate = [
            // 1. La personne principale (l'enfant)
            {
                treeId,
                ownerId,
                position: 1,
                firstName: 'Case',
                lastName: '1',
            },
            // 2. Le premier parent
            {
                treeId,
                ownerId,
                position: 2,
                firstName: 'Case',
                lastName: '2',
            },
            // 3. Le second parent
            {
                treeId,
                ownerId,
                position: 3,
                firstName: 'Case',
                lastName: '3',
            }
        ];

        // On insère les 3 documents dans la base de données
        const [child, parent1, parent2] = await Individual.insertMany(individualsToCreate);

        // --- Établissement de la relation ---
        // On s'assure que les 3 ont bien été créés avant de les lier
        if (child && parent1 && parent2) {
            // On met à jour le document de l'enfant pour lui assigner ses parents
            await Individual.findByIdAndUpdate(child._id, {
                $set: { parents: [parent1._id, parent2._id] }
            });
            // Bonus : On met aussi à jour les documents des parents pour leur assigner l'enfant
            await Individual.findByIdAndUpdate(parent1._id, { $addToSet: { children: child._id } });
            await Individual.findByIdAndUpdate(parent2._id, { $addToSet: { children: child._id } });
        }

        res.status(201).json({ 
            message: 'Arbre initial (enfant + 2 parents) créé avec succès.',
            treeId: treeId 
        });

    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la création de l\'arbre', error: error.message });
    }
};


/**
 * @desc    Créer un nouvel individu (pour l'expansion de l'arbre)
 * @route   POST /api/individuals
 * @access  Public
 */
const createIndividual = async (req, res) => {
    try {
        // On récupère maintenant aussi la position et le treeId
        const { firstName, lastName, gender, birth, death, marriages, position, treeId } = req.body;

        if (!firstName || !position || !treeId) {
            return res.status(400).json({ message: 'Les champs prénom, position et treeId sont requis.' });
        }
        
        const ownerId = "user_placeholder_id";

        const newIndividual = new Individual({
            ownerId, treeId, position, firstName, lastName, gender, birth, death, marriages
        });

        const savedIndividual = await newIndividual.save();
        res.status(201).json(savedIndividual);

    } catch (error) {
        res.status(400).json({ message: 'Erreur lors de la création de l\'individu', error: error.message });
    }
};

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

const getIndividualById = async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'L\'ID de l\'individu fourni est invalide.' });
        }

        const individual = await Individual.findById(id);

        if (!individual) {
            return res.status(404).json({ message: 'Aucun individu trouvé avec cet ID.' });
        }

        res.status(200).json(individual);
    } catch (error) {
        res.status(500).json({ message: 'Erreur du serveur lors de la récupération des données.', error: error.message });
    }
};

const updateIndividual = async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'L\'ID de l\'individu fourni est invalide.' });
        }

        const updatedIndividual = await Individual.findByIdAndUpdate(
            id, 
            req.body, 
            { new: true, runValidators: true }
        );

        if (!updatedIndividual) {
            return res.status(404).json({ message: 'Aucun individu trouvé avec cet ID.' });
        }

        res.status(200).json(updatedIndividual);
    } catch (error) {
        res.status(500).json({ message: 'Erreur du serveur lors de la mise à jour.', error: error.message });
    }
};

const deleteIndividual = async (req, res) => {
    try {
        const { id } = req.params;
        if (!individual) {
            return res.status(404).json({ message: 'Aucun individu trouvé avec cet ID.' });
        }

        res.status(200).json({ message: 'Individu supprimé avec succès.', id: id });
    } catch (error) {
        res.status(500).json({ message: 'Erreur du serveur lors de la suppression.', error: error.message });
    }
};

const deleteTree = async (req, res) => {
    try {
        const { treeId } = req.params;
        if (!mongoose.Types.ObjectId.isValid(treeId)) {
            return res.status(400).json({ message: 'L\'ID de l\'arbre fourni est invalide.' });
        }

        const deleteResult = await Individual.deleteMany({ treeId: treeId });

        if (deleteResult.deletedCount === 0) {
            return res.status(404).json({ message: 'Aucun arbre trouvé avec cet ID.' });
        }

        res.status(200).json({ 
            message: `Arbre supprimé avec succès. ${deleteResult.deletedCount} individus ont été retirés.`
        });

    } catch (error) {
        res.status(500).json({ message: 'Erreur du serveur lors de la suppression de l\'arbre.', error: error.message });
    }
};


module.exports = {
    createInitialTree,
    createIndividual,
    getIndividualsByTreeId,
    getIndividualById,
    updateIndividual,
    deleteIndividual,
    deleteTree
};
