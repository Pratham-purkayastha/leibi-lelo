import React, { useState } from "react";
import { motion } from "framer-motion";
import "./TossScreen.css";

export default function TossScreen({ onAction, setGameSettings }) {
  const [step, setStep] = useState(0);
  const [choice, setChoice] = useState(null);
  const [userNumber, setUserNumber] = useState(null);
  const [result, setResult] = useState(null);
  const [aiNumber, setAiNumber] = useState(null);
  const [playerWon, setPlayerWon] = useState(false);
  const [overs, setOvers] = useState(null);
  const [wickets, setWickets] = useState(null);
  const [selectedBatBowl, setSelectedBatBowl] = useState(null);

  const handleChoice = (pick) => {
    setChoice(pick);
    setStep(2);
  };

  const handleNumber = (num) => {
    const aiNum = Math.floor(Math.random() * 6) + 1;
    const sum = num + aiNum;
    const outcome = sum % 2 === 0 ? "even" : "odd";

    const won = outcome === choice;
    setPlayerWon(won);
    setAiNumber(aiNum);

    if (won) {
      setResult(`You won the toss! 🎉`);
    } else {
      setResult(`AI won the toss! 🤖`);
    }

    setUserNumber(num);
    setStep(3);
  };

  const handleBatBowlChoice = (pick) => {
    setSelectedBatBowl(pick);

    // ✅ Save settings before moving to Game
    setGameSettings({
      overs,
      wickets,
      batOrBowl: pick,
    });

    setTimeout(() => {
      onAction("game");
    }, 1500);
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

      {/* Background */}
      <img src="/images/night.png" alt="background" className="toss-background" />

      {/* Stadium Lights */}
      <img src="/images/stadiumlight.png" alt="light left" className="toss-light-left" />
      <img src="/images/stadiumlight1.png" alt="light right" className="toss-light-right" />

      {/* Stumps */}
      <img src="/images/stumps1.png" alt="stumps" className="toss-stumps" />

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
          <h2 className="toss-title">Choose Odd or Even</h2>
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
            {/* Player */}
            <div className="toss-player-side">
              <div className="toss-avatar">🧑‍🦱</div>
              <div className="toss-player-label">You</div>
              <motion.div
                className="toss-result-ball toss-slide-right"
                initial={{ x: -200, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
              >
                <img src="/images/ball1.png" alt="ball" className="toss-ball-img" />
                <span className="toss-result-number">{userNumber}</span>
              </motion.div>
            </div>

            {/* Center */}
            <div className="toss-calculation">
              <div className="toss-calc-line">
                <span className="toss-calc-number">{userNumber}</span>
                <span className="toss-calc-plus">+</span>
                <span className="toss-calc-number">{aiNumber}</span>
                <span className="toss-calc-equals">=</span>
                <span className="toss-calc-sum">{userNumber + aiNumber}</span>
              </div>
              <div className="toss-calc-result">
                ({(userNumber + aiNumber) % 2 === 0 ? "Even" : "Odd"})
              </div>
            </div>

            {/* AI */}
            <div className="toss-ai-side">
              <div className="toss-avatar">🤖</div>
              <div className="toss-ai-label">AI</div>
              <motion.div
                className="toss-result-ball toss-slide-left"
                initial={{ x: 200, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
              >
                <img src="/images/ball1.png" alt="ball" className="toss-ball-img" />
                <span className="toss-result-number">{aiNumber}</span>
              </motion.div>
            </div>
          </div>

          <div className="toss-final-result">
            {playerWon ? (
              <>
                <h1 className="toss-win-text">You Won the Toss 🎉</h1>
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
              <h1 className="toss-lose-text">AI Won the Toss 🤖</h1>
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
          {playerWon ? (
            <>
              <h2 className="toss-title">Choose to Bat or Bowl</h2>
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
              <h2 className="toss-title">AI is deciding...</h2>
              <p className="toss-title">
                AI chose to {Math.random() > 0.5 ? "Bat" : "Bowl"} first
              </p>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="toss-proceed-btn"
                style={{ marginTop: "40px" }}
                onClick={() => onAction("game")}
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


