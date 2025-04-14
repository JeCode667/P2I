import React from "react";
import "./Chat.css";
import Bubble from "../Bubble/Bubble";

const Chat = ({ messages }) => {
  return (
    <div className="chat-container">
      {messages.map((message, index) => (
        <Bubble key={index} message={message} />
      ))}
    </div>
  );
};

export default Chat;
