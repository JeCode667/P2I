import React, { createContext, useState, useContext } from "react";

// Crée le contexte
const ModelContext = createContext();

// Fournisseur du contexte
export function ModelProvider({ children }) {
  const [model, setModel] = useState("gpt2"); // Modèle par défaut

  return (
    <ModelContext.Provider value={{ model, setModel }}>
      {children}
    </ModelContext.Provider>
  );
}

// Hook personnalisé pour utiliser le contexte
export function useModel() {
  return useContext(ModelContext);
}
