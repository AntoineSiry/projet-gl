import React, { useState, useEffect } from 'react';
import IndividualNode from './IndividualNode';

// Affiche l'ensemble de l'arbre (pour l'instant, une simple grille).
function GenealogyTree({ onNodeSelect }) {
    const [individuals, setIndividuals] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // Au chargement, on récupère les données de l'arbre depuis l'API.
    useEffect(() => {
        const fetchTreeData = async () => {
            // NOTE : Pour l'instant, on utilise un treeId "en dur".
            // Plus tard, il viendra de l'utilisateur connecté.
            const treeId = '667c7a5231711c1341e0d3a5'; // Remplacez par un treeId existant dans votre DB pour tester

            try {
                const response = await fetch(`http://localhost:5000/api/individuals/${treeId}`);
                if (!response.ok) {
                    throw new Error('Les données de l\'arbre n\'ont pas pu être chargées.');
                }
                const data = await response.json();
                setIndividuals(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchTreeData();
    }, []);

    if (isLoading) return <div className="text-white">Chargement de l'arbre...</div>;
    if (error) return <div className="text-red-500">Erreur: {error}</div>;

    return (
        <div className="w-full h-full p-8">
            <h2 className="text-3xl text-white font-bold mb-8 text-center">Arbre Généalogique</h2>
            {individuals.length > 0 ? (
                 <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
                    {individuals.map(individual => (
                        <IndividualNode 
                            key={individual._id} 
                            individual={individual}
                            onSelect={onNodeSelect} // Fait remonter l'événement de clic
                        />
                    ))}
                </div>
            ) : (
                <p className="text-slate-400 text-center">Aucun individu dans cet arbre. Commencez par en ajouter un !</p>
            )}
           
        </div>
    );
}

export default GenealogyTree;
