import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import InfoPage from "./pages/InfoPage/InfoPage";
import ChatPage from "./pages/ChatPage/ChatPage";
import Header from "./components/Header/Header";
import { ModelProvider } from "./context/modelContext";

function App() {
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("theme") === "dark"
  );

  const handleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add("dark-mode");
      localStorage.setItem("theme", "dark");
    } else {
      document.body.classList.remove("dark-mode");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  return (
    <ModelProvider>
      <Router>
        <Header handleDarkMode={handleDarkMode} darkMode={darkMode} />
        <Routes>
          <Route
            path="/"
            element={
              <ChatPage darkMode={darkMode} handleDarkMode={handleDarkMode} />
            }
          />
          <Route path="/info" element={<InfoPage />} />{" "}
          {/* Si vous avez une page d'informations */}
        </Routes>
        <p className="avertissement">
          Le modèle peut faire des erreurs. Veuillez vérifier les informations
          importantes.
        </p>
      </Router>
    </ModelProvider>
  );
}

export default App;
