import React from 'react';

// Ce composant gère l'affichage et l'animation du panneau latéral.
// - isOpen: booléen pour contrôler la visibilité
// - onClose: fonction pour fermer le panneau
// - children: le contenu à afficher à l'intérieur (notre formulaire)
function SidePanel({ isOpen, onClose, children }) {
    return (
        <>
            {/* Overlay qui assombrit le reste de la page quand le panneau est ouvert */}
            <div 
                className={`fixed inset-0 bg-black/50 z-20 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                onClick={onClose}
            ></div>

            {/* Le panneau lui-même */}
            <div
                className={`fixed top-0 right-0 h-full w-full max-w-md bg-slate-800 shadow-2xl z-30 transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
            >
                <div className="h-full flex flex-col">
                    {/* Bouton de fermeture */}
                    <button 
                        onClick={onClose}
                        className="absolute top-4 right-4 text-slate-400 hover:text-white"
                        aria-label="Fermer le panneau"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                    </button>
                    
                    {/* Contenu du panneau (le formulaire) */}
                    <div className="p-6 pt-12 overflow-y-auto flex-grow">
                        {children}
                    </div>
                </div>
            </div>
        </>
    );
}

export default SidePanel;
