import * as React from "react";
import "./Header.css";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import HomeSharpIcon from "@mui/icons-material/HomeSharp";
import BedtimeOutlinedIcon from "@mui/icons-material/BedtimeOutlined";
import WbSunnyOutlinedIcon from "@mui/icons-material/WbSunnyOutlined";

export default function Header({ handleDarkMode, darkMode }) {
  return (
    <div className="header">
      {darkMode ? (
        <WbSunnyOutlinedIcon onClick={handleDarkMode} className="button" />
      ) : (
        <BedtimeOutlinedIcon onClick={handleDarkMode} className="button" />
      )}
      <InfoOutlinedIcon />
    </div>
  );
}
