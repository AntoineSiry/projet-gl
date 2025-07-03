import React, { useState } from 'react';
import EditTreeView from './components/EditTreeView';
import SidePanel from './components/SidePanel';
import IndividualForm from './components/IndividualForm';

function App() {
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [selectedIndividual, setSelectedIndividual] = useState(null);

  // Fonction appelée par EditTreeView quand on clique sur "Editer"
  const handleNodeSelect = (node) => {
    // On simule les données à passer au formulaire
    const individualDataForForm = {
        _id: node.id,
        firstName: node.data.label,
        // ... autres champs pourraient être ici
    };
    setSelectedIndividual(individualDataForForm);
    setIsPanelOpen(true);
  };
  
  const handleClosePanel = () => {
    setIsPanelOpen(false);
    setSelectedIndividual(null);
  };

  return (
    <div className="w-full h-screen bg-slate-900 flex flex-col">
      <header className="p-4 bg-slate-800 border-b border-slate-700 flex-shrink-0">
        <h1 className="text-2xl font-bold text-white">Projet Généa-logique - Mode Édition</h1>
      </header>
      
      <main className="flex-grow">
        <EditTreeView 
          onNodeSelect={handleNodeSelect} 
        />
      </main>

      <SidePanel isOpen={isPanelOpen} onClose={handleClosePanel}>
        {selectedIndividual && (
            <IndividualForm 
                individualToEdit={selectedIndividual}
                onFormSuccess={() => alert('Modifications enregistrées !')}
            />
        )}
      </SidePanel>
    </div>
  );
}

export default App;
