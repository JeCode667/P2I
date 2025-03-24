import React from "react";
import "./Chat.css";
import Bubble from "../Bubble/Bubble";

const Chat = ({ messages, darkMode }) => {
  return (
    <div className="chat-container">
      {messages.map((message, index) => (
        <Bubble key={index} message={message} darkMode={darkMode} />
      ))}
    </div>
  );
};

export default Chat;
