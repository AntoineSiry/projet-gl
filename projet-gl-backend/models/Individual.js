// Importe mongoose pour créer le schéma et le modèle
const mongoose = require('mongoose');

// Définition du schéma pour les mariages (sera un sous-document)
const marriageSchema = new mongoose.Schema({
    spouseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Individual' // Crée une référence à un autre document Individual
    },
    date: Date,
    place: String
});

// Définition du schéma principal pour un Individu
const individualSchema = new mongoose.Schema({
    // treeId est utilisé pour regrouper tous les individus d'un même arbre.
    // C'est essentiel pour s'assurer qu'un utilisateur ne voit que ses propres données.
    treeId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        index: true // Un index améliore les performances des requêtes de recherche par treeId
    },
    // ownerId identifie le propriétaire de l'arbre. Utile pour la gestion des droits.
    ownerId: {
        type: String,
        required: true
    },
    firstName: {
        type: String,
        required: [true, 'Le prénom est requis.'], // Message d'erreur personnalisé
        trim: true // Supprime les espaces superflus au début et à la fin
    },
    lastName: {
        type: String,
        trim: true
    },
    gender: {
        type: String,
        enum: ['Homme', 'Femme', 'Autre'] // Le genre doit être une de ces valeurs
    },
    birth: {
        date: Date,
        place: {
            type: String,
            trim: true
        }
    },
    death: {
        date: Date,
        place: {
            type: String,
            trim: true
        }
    },
    // Un individu peut avoir plusieurs mariages, d'où un tableau de sous-documents
    marriages: [marriageSchema],
    // Références vers les parents (tableau d'identifiants d'autres Individus)
    parents: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Individual'
    }],
    // Références vers les enfants (tableau d'identifiants d'autres Individus)
    children: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Individual'
    }]
}, {
    // Ajoute automatiquement les champs `createdAt` et `updatedAt`
    timestamps: true
});

// Crée et exporte le modèle 'Individual' basé sur le schéma.
// Mongoose nommera automatiquement la collection 'individuals' (au pluriel) dans la DB.
module.exports = mongoose.model('Individual', individualSchema);
