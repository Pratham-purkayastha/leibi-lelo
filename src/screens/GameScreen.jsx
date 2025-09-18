import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./GameScreen.css";

const GameScreen = ({ onAction, gameSettings }) => {
  const { overs = 1, wicketsLimit = 1, batOrBowl = "bat" } = {
    overs: gameSettings?.overs || 1,
    wicketsLimit: gameSettings?.wickets || 1,
    batOrBowl: gameSettings?.batOrBowl || "bat",
  };

  const [showRules, setShowRules] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [inning, setInning] = useState(1);
  const [playerScore, setPlayerScore] = useState(0);
  const [computerScore, setComputerScore] = useState(0);
  const [wickets, setWickets] = useState(0);
  const [balls, setBalls] = useState(overs * 6);
  const [target, setTarget] = useState(null);

  const [playerHand, setPlayerHand] = useState(null);
  const [computerHand, setComputerHand] = useState(null);

  const [playerMsg, setPlayerMsg] = useState("");
  const [computerMsg, setComputerMsg] = useState("");
  const [centerResult, setCenterResult] = useState("");

  const [scoredRun, setScoredRun] = useState(null);
  const [inningOver, setInningOver] = useState(false);

  const [flyingBall, setFlyingBall] = useState(null);
  const [readyText, setReadyText] = useState(false);
  const [buttonsDisabled, setButtonsDisabled] = useState(false);

  // Determine if player is batting
  const isPlayerBatting =
    (inning === 1 && batOrBowl === "bat") ||
    (inning === 2 && batOrBowl === "bowl");

  // ✅ Proper batting label
  const currentBattingLabel = isPlayerBatting
    ? "🏏 You're Batting"
    : "⚾ Computer is Batting";

  // Overs calculation like 0.1/1
  const oversBowled = () => {
    const ballsBowled = overs * 6 - balls;
    const ov = Math.floor(ballsBowled / 6);
    const rem = ballsBowled % 6;
    return `${ov}.${rem}/${overs}`;
  };

  const handleChoice = (num) => {
    if (inningOver || balls <= 0 || flyingBall || buttonsDisabled) return;

    setFlyingBall(num);
    setButtonsDisabled(true);

    setTimeout(() => {
      const comp = Math.floor(Math.random() * 6) + 1;

      // Clear previous hand animations first
      setPlayerHand(null);
      setComputerHand(null);
      setPlayerMsg("");
      setComputerMsg("");

      // Show chosen hands after a brief delay
      setTimeout(() => {
        setPlayerHand(num);
        setComputerHand(comp);
        setPlayerMsg(`You chose ${num}`);
        setComputerMsg(`Computer chose ${comp}`);
      }, 200);

      // Batting side decides runs
      const batsmanRun = isPlayerBatting ? num : comp;

      if (num === comp) {
        setCenterResult("OUT!");
        setWickets((w) => w + 1);
      } else {
        setCenterResult(`${batsmanRun} Runs!`);
        setScoredRun(batsmanRun);

        setTimeout(() => {
          if (isPlayerBatting) {
            setPlayerScore((s) => s + batsmanRun);
          } else {
            setComputerScore((s) => s + batsmanRun);
          }
          setScoredRun(null);
        }, 1000);
      }

      setBalls((b) => b - 1);
      setFlyingBall(null);

      // Clear result after delay → show ready banner
      setTimeout(() => {
        setCenterResult("");
        setReadyText(true);
        setTimeout(() => {
          setReadyText(false);
          setButtonsDisabled(false);
        }, 1500);
      }, 1500);
    }, 1200);
  };

  // ✅ FIX innings end check
  useEffect(() => {
    if (balls === 0 || wickets >= wicketsLimit) {
      if (inning === 1) {
        const firstInningScore =
          batOrBowl === "bat" ? playerScore : computerScore;
        setTarget(firstInningScore + 1);
        setInningOver(true);
      } else {
        setInningOver(true);
      }
    }

    // Stop game if target achieved
    if (inning === 2 && target !== null) {
      if (!isPlayerBatting && computerScore >= target) {
        setInningOver(true);
      }
      if (isPlayerBatting && playerScore >= target) {
        setInningOver(true);
      }
    }
  }, [balls, wickets, playerScore, computerScore]);

  const startSecondInnings = () => {
    setInning(2);
    setBalls(overs * 6);
    setWickets(0);
    setInningOver(false);
    setPlayerHand(null);
    setComputerHand(null);
    setCenterResult("");
    setPlayerMsg("");
    setComputerMsg("");
  };

  const restartGame = () => {
    setInning(1);
    setPlayerScore(0);
    setComputerScore(0);
    setWickets(0);
    setBalls(overs * 6);
    setTarget(null);
    setPlayerHand(null);
    setComputerHand(null);
    setPlayerMsg("");
    setComputerMsg("");
    setCenterResult("");
    setScoredRun(null);
    setInningOver(false);
    setFlyingBall(null);
    setReadyText(false);
    setButtonsDisabled(false);
    setShowSettings(false);
  };

  return (
    <div
      className="game-screen"
      style={{ backgroundImage: "url('/images/gameplay.png')" }}
    >
      {/* Rules Modal */}
      <AnimatePresence>
        {showRules && (
          <motion.div
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="modal"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
            >
              <h2>📜 Game Rules</h2>
              <p>Choose a number between 1–6. If computer chooses the same → OUT!</p>
              <p>Otherwise, runs are added for whoever is batting.</p>
              <button onClick={() => setShowRules(false)}>Start Game</button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Settings Modal */}
      <AnimatePresence>
        {showSettings && (
          <motion.div
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="modal settings-modal"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
            >
              <h2>⚙️ Settings</h2>
              
              <div className="settings-section">
                <h3>📜 Game Rules</h3>
                <p>Choose a number between 1–6. If computer chooses the same → OUT!</p>
                <p>Otherwise, runs are added for whoever is batting.</p>
              </div>

              <div className="settings-section">
                <h3>🔊 Sound Options</h3>
                <label>
                  <input type="checkbox" defaultChecked /> Enable Sound Effects
                </label>
                <label>
                  <input type="checkbox" defaultChecked /> Enable Background Music
                </label>
              </div>

              <div className="settings-section">
                <h3>ℹ️ About Game</h3>
                <p>Hand Cricket Mini Project</p>
                <p><strong>Made by:</strong> Pratham, Leibi, Jungshijong</p>
                <p>Digital version of traditional hand cricket game</p>
              </div>

              <div className="settings-buttons">
                <button className="restart-btn" onClick={restartGame}>
                  🔄 Restart Game
                </button>
                <button onClick={() => setShowSettings(false)}>Close</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Scoreboard */}
      <div className="game-scoreboard">
        <div className="gs-row">
          <span>Inning: {inning}</span>
          <div className="batting-info">{currentBattingLabel}</div>
          <button className="settings-btn" onClick={() => setShowSettings(true)}>
            ⚙️
          </button>
        </div>
        <div className="gs-big">
          <div className="gs-player">
            <div className="gs-subtitle">Runs</div>
            <div className="gs-score">
              {isPlayerBatting ? playerScore : computerScore}
            </div>
          </div>
          <div className="gs-vertical-divider"></div>
          <div className="gs-player">
            <div className="gs-subtitle">Wickets</div>
            <div className="gs-score">
              {wickets}/{wicketsLimit}
            </div>
          </div>
        </div>
        <div className="smalls">
          <span>Overs: {oversBowled()}</span>
          <span>Balls Left: {balls}</span>
        </div>
        {inning === 2 && <div className="target">Target: {target}</div>}
      </div>

      {/* Play Area */}
      <div className="play-area">
        {/* Player Side */}
        <div className="side player-side">
          <AnimatePresence>
            {playerHand && (
              <motion.div
                initial={{ x: -100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -100, opacity: 0 }}
                transition={{ duration: 0.5 }}
              >
                <img
                  src={`/images/handfinger${playerHand}.png`}
                  alt={`Player hand ${playerHand}`}
                  className="hand-img"
                />
                <motion.div
                  className="hand-msg player-msg glow-text-enhanced"
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.3, duration: 0.4 }}
                >
                  {playerMsg}
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Center Stage */}
        <div className="center-stage">
          {/* Ball Row */}
          <div className="ball-row">
            {[1, 2, 3, 4, 5, 6].map((num) => (
              <div className="ball-slot" key={num}>
                <motion.button
                  className="number-ball-btn"
                  onClick={() => handleChoice(num)}
                  disabled={buttonsDisabled}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <motion.img
                    src="/images/ball1.png"
                    alt="ball"
                    className="ball-img-enhanced"
                    animate={
                      flyingBall === num
                        ? {
                            y: -300,
                            scale: 1.8,
                            rotate: 1080,
                            opacity: 0,
                          }
                        : {
                            y: 0,
                            scale: 1,
                            rotate: 0,
                            opacity: 1,
                          }
                    }
                    transition={{ duration: 1.2, ease: "easeInOut" }}
                  />
                  <span className="ball-number-label">{num}</span>
                </motion.button>
              </div>
            ))}
          </div>

          {/* Center Result */}
          <div className="center-result-wrap">
            <AnimatePresence>
              {centerResult && (
                <motion.div
                  key={centerResult + balls}
                  className={`center-result ${
                    centerResult.includes("OUT") ? "out" : "runs"
                  }`}
                  initial={{ scale: 0.3, opacity: 0, rotateY: -90 }}
                  animate={{ scale: 1.1, opacity: 1, rotateY: 0 }}
                  exit={{ scale: 0.3, opacity: 0, rotateY: 90 }}
                  transition={{ duration: 0.6, ease: "backOut" }}
                >
                  {centerResult}
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence>
              {scoredRun && (
                <motion.div
                  key={scoredRun}
                  className="fly-run"
                  initial={{ y: 0, opacity: 1, scale: 1 }}
                  animate={{
                    y: -280,
                    opacity: 0,
                    rotate: 720,
                    scale: 1.5,
                  }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 1.2, ease: "easeOut" }}
                >
                  +{scoredRun}
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence>
              {readyText && (
                <motion.div
                  className="ready-text-enhanced"
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.5, opacity: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  ⚡ Get Ready for Next Ball ⚡
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Computer Side */}
        <div className="side computer-side">
          <AnimatePresence>
            {computerHand && (
              <motion.div
                initial={{ x: 100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: 100, opacity: 0 }}
                transition={{ duration: 0.5 }}
              >
                <img
                  src={`/images/handfinger${computerHand}.png`}
                  alt={`Computer hand ${computerHand}`}
                  className="hand-img"
                />
                <motion.div
                  className="hand-msg computer-msg glow-text-enhanced"
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.3, duration: 0.4 }}
                >
                  {computerMsg}
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Inning Over */}
      <AnimatePresence>
        {inningOver && (
          <motion.div
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="modal innings-modal"
              initial={{ scale: 0.5, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.5, opacity: 0, y: 50 }}
              transition={{ duration: 0.6, ease: "backOut" }}
            >
              <h2>🏏 INNINGS OVER</h2>
              <div className="innings-score">
                Score: {isPlayerBatting ? playerScore : computerScore}/{wickets}
              </div>
              {inning === 1 && (
                <div className="innings-target">
                  Target: {target} runs in {overs} overs
                </div>
              )}
              {inning === 1 ? (
                <button onClick={startSecondInnings}>Start Second Innings</button>
              ) : (
                <button onClick={() => alert("Game Over → Show Result Screen")}>
                  Show Result
                </button>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default GameScreen;








