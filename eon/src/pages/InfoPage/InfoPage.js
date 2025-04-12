import React from "react";
import { useNavigate } from "react-router-dom";
import "./InfoPage.css";
import Logo from "../../components/Logo/Logo";

export default function InfoPage() {
  const navigate = useNavigate();

  return (
    <div className="info-page">
      <div className="Logo">
        <Logo />
      </div>
      <div className="info">
        <p>
          Bienvenue sur la page d'informations. Voici quelques détails utiles :
        </p>
        <ul>
          <li>Ce projet utilise React et Material-UI.</li>
          <li>Vous pouvez basculer entre le mode clair et sombre.</li>
          <li>
            Cette application est responsive et s'adapte à toutes les tailles
            d'écran.
          </li>
        </ul>
        <button onClick={() => navigate("/")}>Retour à l'accueil</button>
      </div>
    </div>
  );
}
