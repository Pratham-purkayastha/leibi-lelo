import React from "react";
import "./HomeScreen.css";

export default function HomeScreen({ onAction }) {
  return (
    <div className="home-container">
      {/* Background */}
      <img src="/images/background.png" alt="background" className="background" />

      {/* Stadium Lights */}
      <img src="/images/stadiumlight.png" alt="stadium lights left" className="stadium-lights-left-home" />
      <img src="/images/stadiumlight1.png" alt="stadium lights right" className="stadium-lights-right-home" />

      {/* Ball */}
      <img src="/images/ball.png" alt="ball" className="ball" />

      {/* Bat */}
      <img src="/images/bat.png" alt="bat" className="bat" />

      {/* Birds */}
      <img src="/images/birds1.png" alt="birds" className="birds" />

      {/* Scoreboard */}
      <div className="scoreboard">
        <h1 className="title">CRICKMATE!</h1>
        <div className="buttons-home">
          <button onClick={() => onAction("toss")} className="btn-home vs-ai-home">
            🤖 VS AI
          </button>
          <button onClick={() => onAction("multiplayer")} className="btn-home multiplayer-home">
            🎮 MULTIPLAYER
          </button>
        </div>
      </div>

      {/* Stumps */}
      <img src="/images/stumps1.png" alt="stumps" className="stumps" />
    </div>
  );
}



