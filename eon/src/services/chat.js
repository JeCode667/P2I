import { useState } from "react";

const API_URL = "http://127.0.0.1:5000/chat/gpt2"; // Remplace par l'URL de ton API

export function useChatbot() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const newMessages = [...messages, { text: input, sender: "user" }];
    setMessages(newMessages);
    setInput("");

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });

      if (!response.ok) {
        throw new Error("Erreur lors de la requête API");
      }

      const data = await response.json();

      // Vérifie si data.message existe avant de l'ajouter
      setMessages([
        ...newMessages,
        { text: data.response || "❌ Réponse invalide", sender: "bot" },
      ]);
    } catch (error) {
      console.error("Erreur API :", error);
      setMessages([
        ...newMessages,
        { text: "❌ Erreur serveur", sender: "bot" },
      ]);
    }
  };

  return { input, setInput, messages, sendMessage };
}
