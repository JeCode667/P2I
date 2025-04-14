import React, { createContext, useState, useContext } from "react";

const ModelContext = createContext();

export function ModelProvider({ children }) {
  const [model, setModel] = useState("rag/trained"); // Modèle par défaut

  return (
    <ModelContext.Provider value={{ model, setModel }}>
      {children}
    </ModelContext.Provider>
  );
}

export function useModel() {
  return useContext(ModelContext);
}
