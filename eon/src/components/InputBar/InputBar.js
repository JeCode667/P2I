import * as React from "react";
import "./InputBar.css";
import SendIcon from "@mui/icons-material/Send";
import TextField from "@mui/material/TextField";

export default function InputBar({ darkMode, setInput, input, sendMessage }) {
  const [history, setHistory] = React.useState(() => {
    // Récupère l'historique depuis le localStorage au chargement
    const savedHistory = localStorage.getItem("chatHistory");
    return savedHistory ? JSON.parse(savedHistory) : [];
  });
  const [historyIndex, setHistoryIndex] = React.useState(-1); // Index courant dans l'historique

  React.useEffect(() => {
    // Sauvegarde l'historique dans le localStorage à chaque mise à jour
    localStorage.setItem("chatHistory", JSON.stringify(history));
  }, [history]);

  const handleKeyDown = (e) => {
    if (e.key === "ArrowUp") {
      // Flèche haut : Aller à la question précédente
      e.preventDefault();
      if (historyIndex > 0) {
        setHistoryIndex(historyIndex - 1);
        setInput(history[historyIndex - 1]);
      } else if (historyIndex === -1 && history.length > 0) {
        // Si on commence à naviguer, afficher la dernière question
        setHistoryIndex(history.length - 1);
        setInput(history[history.length - 1]);
      }
    } else if (e.key === "ArrowDown") {
      // Flèche bas : Aller à la question suivante
      e.preventDefault();
      if (historyIndex < history.length - 1) {
        setHistoryIndex(historyIndex + 1);
        setInput(history[historyIndex + 1]);
      } else if (historyIndex === history.length - 1) {
        setInput("");
      }
    } else if (e.key === "Enter" && !e.shiftKey) {
      // Touche Entrée : Envoie le message
      e.preventDefault(); // Empêche le saut de ligne
      handleSendMessage();
    }
  };

  const handleSendMessage = () => {
    if (input.trim() !== "") {
      setHistory([...history, input]); // Ajoute la question à l'historique
      setHistoryIndex(-1); // Réinitialise l'index
      sendMessage(); // Envoie le message
    }
  };

  return (
    <div className="inputbar">
      <TextField
        variant="standard"
        multiline
        minRows={1}
        maxRows={10}
        placeholder="Posez votre question"
        InputProps={{
          disableUnderline: true,
          style: { color: darkMode ? "white" : "black" },
        }}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown} // Gère les flèches du clavier et Entrée
        className="textField"
      />
      <SendIcon className="sendIcon" onClick={handleSendMessage} />
    </div>
  );
}
