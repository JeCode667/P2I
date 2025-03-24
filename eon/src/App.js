import { useEffect, useState } from "react";
import "./App.css";
import Header from "./components/Header/Header";
import Logo from "./components/Logo/Logo";
import InputBar from "./components/InputBar/InputBar";
import { useChatbot } from "./services/chat";
import Chat from "./components/Chat/Chat";

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

  const { input, setInput, messages, sendMessage } = useChatbot();

  return (
    <div className="App" style={{ padding: 20 }}>
      <Header handleDarkMode={handleDarkMode} darkMode={darkMode} />
      <Logo />
      <Chat messages={messages} darkMode={darkMode} />
      <InputBar
        darkMode={darkMode}
        setInput={setInput}
        input={input}
        sendMessage={sendMessage}
      />
      <p className="avertissement">
        Le modèle peut faire des erreurs. Veuillez vérifier les informations
        importantes.
      </p>
    </div>
  );
}

export default App;
