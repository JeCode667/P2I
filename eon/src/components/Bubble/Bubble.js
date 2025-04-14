import * as React from "react";
import "./Bubble.css";

export default function Bubble({ message }) {
  var bubbleClass = "bubble model";

  if (message.sender === "user") bubbleClass = "bubble user";

  return (
    <div className={bubbleClass}>
      <p>{message.text}</p>
    </div>
  );
}
