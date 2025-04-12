import { useState } from "react";

const API_URL = "http://127.0.0.1:5000/chat/"; // Remplace par l'URL de ton API

export function useChatbot(model = "gpt2") {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const newMessages = [...messages, { text: input, sender: "user" }];
    setMessages([...newMessages, { text: " . . . ", sender: "bot" }]); // Ajoute les points de suspension
    setInput("");

    try {
      const response = await fetch(API_URL + model, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });

      if (!response.ok) {
        throw new Error("Erreur lors de la requête API");
      }

      const data = await response.json();

      // Remplace les points de suspension par la réponse du serveur
      setMessages([
        ...newMessages,
        { text: data.response || "❌ Réponse invalide", sender: "bot" },
      ]);
    } catch (error) {
      console.error("Erreur API :", error);

      // Remplace les points de suspension par un message d'erreur
      setMessages([
        ...newMessages,
        { text: "❌ Erreur serveur", sender: "bot" },
      ]);
    }
  };

  return { input, setInput, messages, sendMessage };
}
