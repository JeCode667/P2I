import * as React from "react";
import "./InputBar.css";
import SendIcon from "@mui/icons-material/Send";
import TextField from "@mui/material/TextField";

export default function InputBar({ darkMode, setInput, input, sendMessage }) {
  return (
    <div className={darkMode ? "inputbar dark-mode" : "inputbar"}>
      <TextField
        variant="standard"
        multiline
        minRows={1}
        maxRows={10}
        placeholder="Posez votre question"
        InputProps={{
          disableUnderline: true, // Supprime le soulignement
          style: { color: darkMode ? "white" : "black" },
        }}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        className="textField"
      />
      <SendIcon className="sendIcon" onClick={sendMessage} />
    </div>
  );
}
