import React from "react";
import "./InfoPage.css";
import Logo from "../../components/Logo/Logo";

export default function InfoPage() {
  return (
    <div className="info-page">
      <div className="Logo">
        <Logo />
      </div>
      <div className="info">
        <h2>C'est quoi ce chatbot sur l'Antiquité ?</h2>
        <p>
          Ce chatbot a été conçu pour répondre à vos questions sur la Grèce et
          la Rome antique. Posez-lui une question et il vous répond en français.
        </p>

        <h3>Comment ça fonctionne ?</h3>
        <p>
          Il combine deux choses :
          <br />
          1. Une intelligence artificielle entraînée à répondre à des questions
          (basée sur GPT-2).
          <br />
          2. Une base de textes historiques fiables qu'il utilise pour trouver
          les bonnes informations avant de répondre.
          <br />
          <br />
          Autrement dit, le chatbot ne répond pas au hasard : il commence par
          chercher des extraits de documents liés à votre question, puis il
          génère une réponse à partir de ce qu'il a trouvé.
        </p>

        <h3>D'où viennent les infos ?</h3>
        <p>
          Les réponses s'appuient sur des résumés Wikipédia, et l'IA a été
          entraînée à extraire les informations et répondre en français à l'aide
          d'un jeu de données, FQuAD (French Native Reading Comprehension
          dataset), développé par Illuin Technology.
        </p>

        <h3>À savoir</h3>
        <p>
          Le chatbot est encore en développement. Il peut parfois se tromper ou
          manquer de précision. N'hésitez pas à reformuler ou poser plusieurs
          questions pour affiner les réponses.
        </p>
      </div>
    </div>
  );
}
