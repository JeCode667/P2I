import { useState, useEffect } from "react";

const API_URL =
  process.env.NODE_ENV === "development"
    ? "http://127.0.0.1:5000/chat/"
    : "https://eon-api-regz.onrender.com/chat/";

export function useChatbot(model = "gpt2") {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState(() => {
    // Récupère les messages depuis le localStorage au chargement
    const savedMessages = localStorage.getItem("chatMessages");
    return savedMessages ? JSON.parse(savedMessages) : [];
  });

  // Sauvegarde les messages dans le localStorage à chaque mise à jour
  useEffect(() => {
    localStorage.setItem("chatMessages", JSON.stringify(messages));
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const newMessages = [...messages, { text: input, sender: "user" }];
    // Ajoute les points de suspension pour indiquer que la réponse est en cours
    setMessages([...newMessages, { text: " . . . ", sender: "bot" }]);
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
