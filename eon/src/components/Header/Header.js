import * as React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./Header.css";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import BedtimeOutlinedIcon from "@mui/icons-material/BedtimeOutlined";
import WbSunnyOutlinedIcon from "@mui/icons-material/WbSunnyOutlined";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { MenuItem, Select } from "@mui/material";
import { useModel } from "../../context/modelContext";

export default function Header({ handleDarkMode, darkMode }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { model, setModel } = useModel();

  const clearChatHistory = () => {
    localStorage.removeItem("chatMessages"); // Supprime l'historique des messages du localStorage
    window.location.reload(); // Recharge la page pour refléter les changements
  };

  return (
    <div className="header">
      <div className="header-left">
        {darkMode ? (
          <WbSunnyOutlinedIcon
            onClick={handleDarkMode}
            className="button"
            titleAccess="Mode clair"
          />
        ) : (
          <BedtimeOutlinedIcon
            onClick={handleDarkMode}
            className="button"
            titleAccess="Mode sombre"
          />
        )}
        {location.pathname === "/info" ? (
          ""
        ) : (
          <>
            <DeleteOutlineIcon
              onClick={clearChatHistory}
              className="button"
              titleAccess="Effacer l'historique"
            />
            <div className="select">
              <Select
                value={model}
                onChange={(e) => setModel(e.target.value)}
                variant="standard"
                sx={{
                  "&:before, &:after, &:hover:not(.Mui-disabled):before": {
                    borderBottom: "none", // Supprime les styles avant et après
                  },
                  color: darkMode ? "white" : "black",
                  borderRadius: "4px",
                }}
                MenuProps={{
                  PaperProps: {
                    style: {
                      backgroundColor: darkMode ? "#5d5d5d" : "white",
                      color: darkMode ? "white" : "black",
                      borderRadius: "4px",
                      maxHeight: "200px",
                    },
                  },
                }}
              >
                <MenuItem value="gpt2">GPT-2</MenuItem>
                <MenuItem value="rag/gpt2">GPT-2 avec RAG</MenuItem>
                <MenuItem value="rag/trained">GPT-2 entraîné avec RAG</MenuItem>
              </Select>
            </div>
          </>
        )}
      </div>
      {location.pathname === "/info" ? (
        <HomeOutlinedIcon
          onClick={() => navigate("/")}
          className="button"
          titleAccess="Retour au chat"
        />
      ) : (
        <InfoOutlinedIcon
          onClick={() => navigate("/info")}
          className="button"
          titleAccess="Informations"
        />
      )}
    </div>
  );
}
