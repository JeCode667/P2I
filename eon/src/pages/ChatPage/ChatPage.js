import React from "react";
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
  const [hasSentMessage, setHasSentMessage] = React.useState(false);

  const sendMessage = () => {
    if (!hasSentMessage) {
      setHasSentMessage(true);
    }
    originalSendMessage();
  };

  return (
    <div
      className={`App ${hasSentMessage ? "chat-active" : ""}`}
      style={{ padding: 20 }}
    >
      <div className="Logo">
        <Logo />
      </div>
      <div className="Chat">
        <Chat messages={messages} darkMode={darkMode} />
      </div>
      <div className="InputBar">
        <InputBar
          darkMode={darkMode}
          setInput={setInput}
          input={input}
          sendMessage={sendMessage}
        />
      </div>
    </div>
  );
}
