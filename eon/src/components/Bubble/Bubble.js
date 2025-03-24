import * as React from "react";
import "./Bubble.css";

export default function Bubble({ message, darkMode }) {
  var bubbleClass = "bubble model";

  if (message.sender === "user") bubbleClass = "bubble user";
  if (darkMode) bubbleClass += " dark-mode";

  return (
    <div className={bubbleClass}>
      <p>{message.text}</p>
    </div>
  );
}
