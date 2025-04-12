import * as React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./Header.css";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import BedtimeOutlinedIcon from "@mui/icons-material/BedtimeOutlined";
import WbSunnyOutlinedIcon from "@mui/icons-material/WbSunnyOutlined";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import { MenuItem, Select } from "@mui/material";
import { useModel } from "../../context/modelContext";

export default function Header({ handleDarkMode, darkMode }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { model, setModel } = useModel();

  return (
    <div className="header">
      <div className="header-left">
        {darkMode ? (
          <WbSunnyOutlinedIcon onClick={handleDarkMode} className="button" />
        ) : (
          <BedtimeOutlinedIcon onClick={handleDarkMode} className="button" />
        )}
        {location.pathname === "/info" ? (
          ""
        ) : (
          <Select
            value={model}
            onChange={(e) => setModel(e.target.value)}
            className="modelSelect"
            variant="standard"
            sx={{
              "& .MuiInputBase-root": {
                borderBottom: "none",
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
            <MenuItem value="rag/gpt2">GPT-2 WITH RAG</MenuItem>
            <MenuItem value="rag/trained">GPT-2 TRAINED WITH RAG</MenuItem>
          </Select>
        )}
      </div>
      {location.pathname === "/info" ? (
        <HomeOutlinedIcon onClick={() => navigate("/")} className="button" />
      ) : (
        <InfoOutlinedIcon
          onClick={() => navigate("/info")}
          className="button"
        />
      )}
    </div>
  );
}
