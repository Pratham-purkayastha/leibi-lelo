import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import "./TossScreen.css";

export default function TossScreen({ onAction, setGameSettings }) {
  const [step, setStep] = useState(0);
  const [choice, setChoice] = useState(null);
  const [player1Number, setPlayer1Number] = useState(null);
  const [result, setResult] = useState(null);
  const [player2Number, setPlayer2Number] = useState(null);
  const [player1Won, setPlayer1Won] = useState(false);
  const [overs, setOvers] = useState(null);
  const [wickets, setWickets] = useState(null);
  const [selectedBatBowl, setSelectedBatBowl] = useState(null);

  // Get player names from localStorage
  const [player1Name, setPlayer1Name] = useState("Player 1");
  const [player2Name, setPlayer2Name] = useState("Player 2");

  useEffect(() => {
    const p1 = localStorage.getItem("player1Name") || "Player 1";
    const p2 = localStorage.getItem("player2Name") || "Player 2";
    setPlayer1Name(p1);
    setPlayer2Name(p2);
  }, []);

  const handleChoice = (pick) => {
    setChoice(pick);
    setStep(2);
  };

  const handleNumber = (num) => {
    const player2Num = Math.floor(Math.random() * 6) + 1;
    const sum = num + player2Num;
    const outcome = sum % 2 === 0 ? "even" : "odd";

    const won = outcome === choice;
    setPlayer1Won(won);
    setPlayer2Number(player2Num);

    if (won) {
      setResult(`${player1Name} won the toss! 🎉`);
    } else {
      setResult(`${player2Name} won the toss! 🎉`);
    }

    setPlayer1Number(num);
    setStep(3);
  };

  // helper: validate settings before continuing
  const validateSettings = () => {
    if (!overs || !wickets) {
      alert("Please choose Overs and Wickets before continuing.");
      return false;
    }
    return true;
  };

  // centralized continuation → build settings object, store names locally, call setGameSettings (App will route to multiplayer game)
  const continueToMultiplayerMatch = (finalBatOrBowl) => {
    if (!validateSettings()) return;

    // Save nicer player names to localStorage (if not already present)
    const hostName = localStorage.getItem("hostName") || player1Name || "Player 1";
    const guestName = localStorage.getItem("guestName") || player2Name || "Player 2";
    localStorage.setItem("player1Name", hostName);
    localStorage.setItem("player2Name", guestName);

    // Build settings payload — IMPORTANT include mode:'multiplayer'
    const settings = {
      overs,
      wickets,
      batOrBowl: finalBatOrBowl,
      mode: "multiplayer",
    };

    // This prop is wired in App.jsx to start the multiplayer game and set screen to "game"
    setGameSettings(settings);

    // optional small UX pause then (App will change the screen; we don't call onAction('game') here)
    console.log("Multiplayer match started with settings:", settings);
  };

  const handleBatBowlChoice = (pick) => {
    setSelectedBatBowl(pick);

    // Use the centralized continuation helper so App gets mode: 'multiplayer'
    continueToMultiplayerMatch(pick);
  };

  // When player2 is the toss winner (AI/opponent) and we auto-decide for them
  const handleAutoDecideForPlayer2 = () => {
    const pick = Math.random() > 0.5 ? "bat" : "bowl";
    setSelectedBatBowl(pick);

    // show a little delay for UX so player sees "Player 2 decided..."
    setTimeout(() => {
      continueToMultiplayerMatch(pick);
    }, 700);
  };

  return (
    <div className="toss-container">
      {/* Animated Stars */}
      <div className="toss-stars">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="toss-star"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
            }}
          ></div>
        ))}
      </div>

      {/* Background - Updated to ground.png */}
      <img src="/images/ground.png" alt="background" className="toss-background" />

      {/* Step 0: Match Settings */}
      {step === 0 && (
        <div className="toss-step1">
          <h2 className="toss-title">Choose Overs & Wickets</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "40px" }}>
            {/* Overs */}
            <div>
              <h3 className="toss-title">Overs</h3>
              <div className="toss-ball-buttons">
                {[1, 3, 5].map((o) => (
                  <motion.button
                    key={o}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className={`toss-setting-btn ${overs === o ? "selected" : ""}`}
                    onClick={() => setOvers(o)}
                  >
                    {o}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Wickets */}
            <div>
              <h3 className="toss-title">Wickets</h3>
              <div className="toss-ball-buttons">
                {[1, 3, 5].map((w) => (
                  <motion.button
                    key={w}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className={`toss-setting-btn ${wickets === w ? "selected" : ""}`}
                    onClick={() => setWickets(w)}
                  >
                    {w}
                  </motion.button>
                ))}
              </div>
            </div>
          </div>

          {overs && wickets && (
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="toss-proceed-btn"
              style={{ marginTop: "40px" }}
              onClick={() => setStep(1)}
            >
              Confirm & Do Toss
            </motion.button>
          )}
        </div>
      )}

      {/* Step 1: Odd/Even */}
      {step === 1 && (
        <div className="toss-step1">
          <h2 className="toss-title">{player1Name}, Choose Odd or Even</h2>
          <div className="toss-ball-buttons">
            <motion.div
              className="toss-cricket-ball"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => handleChoice("odd")}
            >
              <img src="/images/ball1.png" alt="ball" className="toss-ball-img" />
              <span className="toss-ball-text">ODD</span>
            </motion.div>
            <motion.div
              className="toss-cricket-ball"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => handleChoice("even")}
            >
              <img src="/images/ball1.png" alt="ball" className="toss-ball-img" />
              <span className="toss-ball-text">EVEN</span>
            </motion.div>
          </div>
        </div>
      )}

      {/* Step 2: Number Selection */}
      {step === 2 && (
        <div className="toss-step2">
          <h2 className="toss-title">Pick a Number (1–6)</h2>
          <div className="toss-number-balls">
            {[1, 2, 3, 4, 5, 6].map((num) => (
              <motion.div
                key={num}
                className="toss-number-ball"
                whileHover={{ scale: 1.15 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => handleNumber(num)}
              >
                <img src="/images/ball1.png" alt="ball" className="toss-ball-img" />
                <span className="toss-number-text">{num}</span>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Step 3: Result Animation */}
      {step === 3 && (
        <div className="toss-step3">
          <div className="toss-battle-arena">
            {/* Player 1 */}
            <div className="toss-player-side">
              <div className="toss-avatar">🧑‍🦱</div>
              <div className="toss-player-label">{player1Name}</div>
              <motion.div
                className="toss-result-ball toss-slide-right"
                initial={{ x: -200, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
              >
                <img src="/images/ball1.png" alt="ball" className="toss-ball-img" />
                <span className="toss-result-number">{player1Number}</span>
              </motion.div>
            </div>

            {/* Center */}
            <div className="toss-calculation">
              <div className="toss-calc-line">
                <span className="toss-calc-number">{player1Number}</span>
                <span className="toss-calc-plus">+</span>
                <span className="toss-calc-number">{player2Number}</span>
                <span className="toss-calc-equals">=</span>
                <span className="toss-calc-sum">{player1Number + player2Number}</span>
              </div>
              <div className="toss-calc-result">
                ({(player1Number + player2Number) % 2 === 0 ? "Even" : "Odd"})
              </div>
            </div>

            {/* Player 2 */}
            <div className="toss-ai-side">
              <div className="toss-avatar">👱🏾</div>
              <div className="toss-ai-label">{player2Name}</div>
              <motion.div
                className="toss-result-ball toss-slide-left"
                initial={{ x: 200, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
              >
                <img src="/images/ball1.png" alt="ball" className="toss-ball-img" />
                <span className="toss-result-number">{player2Number}</span>
              </motion.div>
            </div>
          </div>

          <div className="toss-final-result">
            {player1Won ? (
              <>
                <h1 className="toss-win-text">{player1Name} Won the Toss 🎉</h1>
                {[...Array(20)].map((_, i) => (
                  <div
                    key={i}
                    className="toss-sparkle"
                    style={{
                      left: `${Math.random() * 100}%`,
                      top: `${Math.random() * 100}%`,
                      animationDelay: `${Math.random()}s`,
                    }}
                  ></div>
                ))}
              </>
            ) : (
              <>
                <h1 className="toss-lose-text">{player2Name} Won the Toss 🎉</h1>
                {[...Array(20)].map((_, i) => (
                  <div
                    key={i}
                    className="toss-sparkle"
                    style={{
                      left: `${Math.random() * 100}%`,
                      top: `${Math.random() * 100}%`,
                      animationDelay: `${Math.random()}s`,
                    }}
                  ></div>
                ))}
              </>
            )}
          </div>

          <div className="toss-action-buttons">
            <button className="toss-proceed-btn" onClick={() => setStep(4)}>
              Next
            </button>
          </div>
        </div>
      )}

      {/* Step 4: Bat/Bowl Choice */}
      {step === 4 && (
        <div className="toss-step1">
          {player1Won ? (
            <>
              <h2 className="toss-title">{player1Name}, Choose to Bat or Bowl</h2>
              <div className="toss-choice-images">
                <img
                  src="/images/batsman1.png"
                  alt="Bat"
                  className={`choice-img ${selectedBatBowl === "bat" ? "selected" : ""}`}
                  onClick={() => handleBatBowlChoice("bat")}
                />
                <img
                  src="/images/baller1.png"
                  alt="Bowl"
                  className={`choice-img ${selectedBatBowl === "bowl" ? "selected" : ""}`}
                  onClick={() => handleBatBowlChoice("bowl")}
                />
              </div>

              {selectedBatBowl && (
                <>
                  <img
                    src={`/images/${selectedBatBowl === "bat" ? "batsman1.png" : "baller1.png"}`}
                    alt="highlight"
                    className="highlight-img"
                  />
                  <p className="toss-title">Waiting for the next screen...</p>
                </>
              )}
            </>
          ) : (
            <>
              <h2 className="toss-title">{player2Name} is deciding...</h2>
              <p className="toss-title">
                {player2Name} chose to {Math.random() > 0.5 ? "Bat" : "Bowl"} first
              </p>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="toss-proceed-btn"
                style={{ marginTop: "40px" }}
                onClick={handleAutoDecideForPlayer2}
              >
                Continue to Match
              </motion.button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
