import React, { useState, useEffect } from 'react';

// Le composant accepte maintenant des props :
// - individualToEdit: les données de la personne à modifier (ou null si création)
// - onFormSuccess: une fonction à appeler quand l'opération réussit
function IndividualForm({ individualToEdit, onFormSuccess }) {
    const [formData, setFormData] = useState({
        firstName: '', lastName: '', gender: 'Autre',
        birthDate: '', birthPlace: '', deathDate: '', deathPlace: '',
        marriageDate: '', marriagePlace: '',
    });

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    // Détermine si on est en mode édition
    const isEditMode = Boolean(individualToEdit);

    // useEffect est utilisé pour pré-remplir le formulaire si on est en mode édition
    useEffect(() => {
        if (isEditMode) {
            // Formate les dates pour les champs <input type="date">
            const formatDate = (date) => date ? new Date(date).toISOString().split('T')[0] : '';
            
            setFormData({
                firstName: individualToEdit.firstName || '',
                lastName: individualToEdit.lastName || '',
                gender: individualToEdit.gender || 'Autre',
                birthDate: formatDate(individualToEdit.birth?.date),
                birthPlace: individualToEdit.birth?.place || '',
                deathDate: formatDate(individualToEdit.death?.date),
                deathPlace: individualToEdit.death?.place || '',
                // Prend le premier mariage pour l'instant
                marriageDate: formatDate(individualToEdit.marriages?.[0]?.date), 
                marriagePlace: individualToEdit.marriages?.[0]?.place || '',
            });
        }
    }, [individualToEdit, isEditMode]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({ ...prevState, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        const apiPayload = {
            firstName: formData.firstName,
            lastName: formData.lastName,
            gender: formData.gender,
            birth: { date: formData.birthDate || null, place: formData.birthPlace },
            death: { date: formData.deathDate || null, place: formData.deathPlace },
            marriages: (formData.marriageDate || formData.marriagePlace) ? [{ date: formData.marriageDate || null, place: formData.marriagePlace }] : [],
        };
        
        // Détermine l'URL et la méthode HTTP en fonction du mode (création ou édition)
        const url = isEditMode 
            ? `http://localhost:5000/api/individuals/${individualToEdit._id}` 
            : 'http://localhost:5000/api/individuals';
        const method = isEditMode ? 'PUT' : 'POST';

        try {
            const response = await fetch(url, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(apiPayload),
            });
            const result = await response.json();
            if (!response.ok) throw new Error(result.message || 'Une erreur est survenue.');

            // Si tout s'est bien passé, on appelle la fonction parent
            onFormSuccess();

        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-slate-800 rounded-lg shadow-xl p-6 md:p-8 w-full max-w-2xl">
            <h2 className="text-2xl font-bold text-white mb-6">
                {isEditMode ? 'Modifier un Individu' : 'Ajouter un Individu'}
            </h2>
            
            {error && <div className="bg-red-500 text-white p-3 rounded-md mb-4">{error}</div>}

            <form onSubmit={handleSubmit} className="space-y-6">
                 {/* ... (tous les champs du formulaire restent identiques) ... */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label htmlFor="firstName" className="block text-sm font-medium text-slate-300 mb-1">Prénom</label>
                        <input type="text" name="firstName" id="firstName" value={formData.firstName} onChange={handleChange} required className="w-full bg-slate-700 text-white rounded-md border-slate-600 focus:ring-sky-500 focus:border-sky-500" />
                    </div>
                    <div>
                        <label htmlFor="lastName" className="block text-sm font-medium text-slate-300 mb-1">Nom</label>
                        <input type="text" name="lastName" id="lastName" value={formData.lastName} onChange={handleChange} className="w-full bg-slate-700 text-white rounded-md border-slate-600 focus:ring-sky-500 focus:border-sky-500" />
                    </div>
                </div>
                <div>
                    <label htmlFor="gender" className="block text-sm font-medium text-slate-300 mb-1">Genre</label>
                    <select name="gender" id="gender" value={formData.gender} onChange={handleChange} className="w-full bg-slate-700 text-white rounded-md border-slate-600 focus:ring-sky-500 focus:border-sky-500" >
                        <option>Homme</option> <option>Femme</option> <option>Autre</option>
                    </select>
                </div>
                <fieldset className="border-t border-slate-700 pt-6">
                    <legend className="text-lg font-medium text-white mb-4">Naissance</legend>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="birthDate" className="block text-sm font-medium text-slate-300 mb-1">Date de naissance</label>
                            <input type="date" name="birthDate" id="birthDate" value={formData.birthDate} onChange={handleChange} className="w-full bg-slate-700 text-white rounded-md border-slate-600 focus:ring-sky-500 focus:border-sky-500" />
                        </div>
                        <div>
                            <label htmlFor="birthPlace" className="block text-sm font-medium text-slate-300 mb-1">Lieu de naissance</label>
                            <input type="text" name="birthPlace" id="birthPlace" value={formData.birthPlace} onChange={handleChange} className="w-full bg-slate-700 text-white rounded-md border-slate-600 focus:ring-sky-500 focus:border-sky-500" />
                        </div>
                    </div>
                </fieldset>
                <fieldset className="border-t border-slate-700 pt-6">
                    <legend className="text-lg font-medium text-white mb-4">Mariage</legend>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="marriageDate" className="block text-sm font-medium text-slate-300 mb-1">Date de mariage</label>
                            <input type="date" name="marriageDate" id="marriageDate" value={formData.marriageDate} onChange={handleChange} className="w-full bg-slate-700 text-white rounded-md border-slate-600 focus:ring-sky-500 focus:border-sky-500"/>
                        </div>
                        <div>
                            <label htmlFor="marriagePlace" className="block text-sm font-medium text-slate-300 mb-1">Lieu de mariage</label>
                            <input type="text" name="marriagePlace" id="marriagePlace" value={formData.marriagePlace} onChange={handleChange} className="w-full bg-slate-700 text-white rounded-md border-slate-600 focus:ring-sky-500 focus:border-sky-500" />
                        </div>
                    </div>
                </fieldset>
                <fieldset className="border-t border-slate-700 pt-6">
                    <legend className="text-lg font-medium text-white mb-4">Décès</legend>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="deathDate" className="block text-sm font-medium text-slate-300 mb-1">Date de décès</label>
                            <input type="date" name="deathDate" id="deathDate" value={formData.deathDate} onChange={handleChange} className="w-full bg-slate-700 text-white rounded-md border-slate-600 focus:ring-sky-500 focus:border-sky-500" />
                        </div>
                        <div>
                            <label htmlFor="deathPlace" className="block text-sm font-medium text-slate-300 mb-1">Lieu de décès</label>
                            <input type="text" name="deathPlace" id="deathPlace" value={formData.deathPlace} onChange={handleChange} className="w-full bg-slate-700 text-white rounded-md border-slate-600 focus:ring-sky-500 focus:border-sky-500" />
                        </div>
                    </div>
                </fieldset>
                <div className="pt-6 text-right">
                    <button type="submit" disabled={isLoading} className="bg-sky-600 hover:bg-sky-700 text-white font-bold py-2 px-6 rounded-lg transition-colors duration-300 disabled:bg-slate-500 disabled:cursor-not-allowed">
                        {isLoading ? 'Sauvegarde...' : 'Enregistrer'}
                    </button>
                </div>
            </form>
        </div>
    );
}

export default IndividualForm;
