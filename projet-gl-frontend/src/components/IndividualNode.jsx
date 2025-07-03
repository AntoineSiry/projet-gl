import React from 'react';

// Représente une seule "case" cliquable dans l'arbre.
function IndividualNode({ individual, onSelect }) {
    return (
        <div
            onClick={() => onSelect(individual)}
            className="bg-slate-700 hover:bg-sky-700 cursor-pointer rounded-lg p-4 text-center text-white transition-colors duration-300"
        >
            <h3 className="font-bold">{individual.firstName} {individual.lastName}</h3>
            <p className="text-sm text-slate-300">{individual.birth?.date ? new Date(individual.birth.date).getFullYear() : '...'} - {individual.death?.date ? new Date(individual.death.date).getFullYear() : '...'}</p>
        </div>
    );
}

export default IndividualNode;
