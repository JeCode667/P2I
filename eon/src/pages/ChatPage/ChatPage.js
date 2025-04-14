import "./ChatPage.css";
import { useChatbot } from "../../services/chat";
import Chat from "../../components/Chat/Chat";
import InputBar from "../../components/InputBar/InputBar";
import Logo from "../../components/Logo/Logo";
import { useModel } from "../../context/modelContext";

export default function ChatPage({ darkMode }) {
  const { model } = useModel();
  const {
    input,
    setInput,
    messages,
    sendMessage: originalSendMessage,
  } = useChatbot(model);

  return (
    <div
      className={`chat ${messages.length > 0 ? "active" : ""}`}
      style={{ padding: 20 }}
    >
      <div className="Logo">
        <Logo />
      </div>
      <div className="Chat">
        <Chat messages={messages} />
      </div>
      <div className="InputBar">
        <InputBar
          darkMode={darkMode}
          setInput={setInput}
          input={input}
          sendMessage={originalSendMessage}
        />
      </div>
      <p className="avertissement">
        Le modèle peut faire des erreurs. Veuillez vérifier les informations
        importantes.
      </p>
    </div>
  );
}
