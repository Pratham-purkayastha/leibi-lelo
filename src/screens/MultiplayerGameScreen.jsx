import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./GameScreen.css"; // reuse existing styles

export default function MultiplayerGameScreen({ onAction, gameSettings, onGameComplete }) {
  // read player names from localStorage (or use defaults)
  const player1Name = localStorage.getItem("player1Name") || "Player 1";
  const player2Name = localStorage.getItem("player2Name") || "Player 2";

  // Prefer gameSettings (from toss) else saved settings
  const savedOvers = Number(gameSettings?.overs ?? localStorage.getItem("selectedOvers")) || 1;
  const savedWickets = Number(gameSettings?.wickets ?? localStorage.getItem("selectedWickets")) || 1;
  const savedBatOrBowl = gameSettings?.batOrBowl || localStorage.getItem("selectedBatOrBowl") || "bat";

  const overs = savedOvers;
  const wicketsLimit = savedWickets;
  const batOrBowl = savedBatOrBowl;

  const [showRules, setShowRules] = useState(true);
  const [showSettings, setShowSettings] = useState(false);

  const [inning, setInning] = useState(1);
  const [player1Score, setPlayer1Score] = useState(0);
  const [player2Score, setPlayer2Score] = useState(0);
  const [wickets, setWickets] = useState(0);
  const [balls, setBalls] = useState(overs * 6);
  const [target, setTarget] = useState(null);

  // hands and messages for animation
  const [player1Hand, setPlayer1Hand] = useState(null);
  const [player2Hand, setPlayer2Hand] = useState(null);
  const [player1Msg, setPlayer1Msg] = useState("");
  const [player2Msg, setPlayer2Msg] = useState("");
  const [centerResult, setCenterResult] = useState("");
  const [scoredRun, setScoredRun] = useState(null);
  const [inningOver, setInningOver] = useState(false);

  const [flyingBall, setFlyingBall] = useState(null);
  const [readyText, setReadyText] = useState(false);
  const [buttonsDisabled, setButtonsDisabled] = useState(false);

  // Phase control for each ball:
  const [pickPhase, setPickPhase] = useState("batter");

  // which player is batting now? (player1 or player2)
  const isPlayer1Batting =
    (inning === 1 && batOrBowl === "bat") ||
    (inning === 2 && batOrBowl === "bowl");

  const battingLabel = isPlayer1Batting ? `${player1Name} is Batting` : `${player2Name} is Batting`;

  // Overs calculation like 0.1/1
  const oversBowled = () => {
    const ballsBowled = overs * 6 - balls;
    const ov = Math.floor(ballsBowled / 6);
    const rem = ballsBowled % 6;
    return `${ov}.${rem}/${overs}`;
  };

  const currentBatterName = isPlayer1Batting ? player1Name : player2Name;
  const currentBowlerName = isPlayer1Batting ? player2Name : player1Name;

  const handlePick = (num) => {
    if (inningOver || balls <= 0 || flyingBall || buttonsDisabled) return;

    setButtonsDisabled(true);

    // Batter picks
    if (pickPhase === "batter") {
      if (isPlayer1Batting) {
        setPlayer1Hand(null);
        setPlayer2Hand(null);
        setPlayer1Msg("");
        setPlayer2Msg("");
        setTimeout(() => {
          setPlayer1Hand(num);
          setPlayer1Msg(`${currentBatterName} chose ${num}`);
        }, 120);
      } else {
        setPlayer2Hand(null);
        setPlayer1Hand(null);
        setPlayer1Msg("");
        setPlayer2Msg("");
        setTimeout(() => {
          setPlayer2Hand(num);
          setPlayer2Msg(`${currentBatterName} chose ${num}`);
        }, 120);
      }

      setPickPhase("bowler");
      setButtonsDisabled(false);
      return;
    }

    // Bowler picks phase
    if (pickPhase === "bowler") {
      let batterPick = isPlayer1Batting ? player1Hand : player2Hand;
      if (!batterPick) batterPick = num;

      if (isPlayer1Batting) {
        setPlayer2Hand(num);
        setPlayer2Msg(`${currentBowlerName} chose ${num}`);
      } else {
        setPlayer1Hand(num);
        setPlayer1Msg(`${currentBowlerName} chose ${num}`);
      }

      setFlyingBall(num);

      setTimeout(() => {
        const bowlerPick = num;
        const batsmanPick = batterPick;

        if (Number(bowlerPick) === Number(batsmanPick)) {
          setCenterResult("OUT!");
          setWickets((w) => w + 1);
        } else {
          const runs = Number(batsmanPick);
          setCenterResult(`${runs} Runs!`);
          setScoredRun(runs);

          setTimeout(() => {
            if (isPlayer1Batting) {
              setPlayer1Score((s) => s + runs);
            } else {
              setPlayer2Score((s) => s + runs);
            }
            setScoredRun(null);
          }, 800);
        }

        setBalls((b) => b - 1);
        setFlyingBall(null);

        setTimeout(() => {
          setCenterResult("");
          setReadyText(true);
          setPickPhase("batter");
          setTimeout(() => {
            setReadyText(false);
            setButtonsDisabled(false);
          }, 1000);
        }, 1000);
      }, 900);
    }
  };

  // End/innings checks
  useEffect(() => {
    if (balls === 0 || wickets >= wicketsLimit) {
      if (inning === 1) {
        const firstInningScore = isPlayer1Batting ? player1Score : player2Score;
        setTarget(firstInningScore + 1);
        setInningOver(true);
      } else {
        setInningOver(true);
      }
    }

    if (inning === 2 && target !== null) {
      if (isPlayer1Batting && player1Score >= target) {
        setInningOver(true);
      }
      if (!isPlayer1Batting && player2Score >= target) {
        setInningOver(true);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [balls, wickets, player1Score, player2Score]);

  const startSecondInnings = () => {
    setInning(2);
    setBalls(overs * 6);
    setWickets(0);
    setInningOver(false);
    setPlayer1Hand(null);
    setPlayer2Hand(null);
    setCenterResult("");
    setPlayer1Msg("");
    setPlayer2Msg("");
    setPickPhase("batter");
  };

  const restartGame = () => {
    setInning(1);
    setPlayer1Score(0);
    setPlayer2Score(0);
    setWickets(0);
    setBalls(overs * 6);
    setTarget(null);
    setPlayer1Hand(null);
    setPlayer2Hand(null);
    setPlayer1Msg("");
    setPlayer2Msg("");
    setCenterResult("");
    setScoredRun(null);
    setInningOver(false);
    setFlyingBall(null);
    setReadyText(false);
    setButtonsDisabled(false);
    setShowSettings(false);
    setPickPhase("batter");
  };

  const battingScore = isPlayer1Batting ? player1Score : player2Score;

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
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.6, opacity: 0 }}
            >
              <h2>📜 Multiplayer Rules</h2>
              <p>
                Local multiplayer: both players use same device. Batter selects first (1–6), then bowler selects (1–6).
              </p>
              <p>Innings switch after overs completed or wickets are lost.</p>
              <button onClick={() => setShowRules(false)}>Start Match</button>
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
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.6, opacity: 0 }}
            >
              <h2>⚙️ Settings</h2>
              <div className="settings-section">
                <h3>Game Info</h3>
                <p>
                  Overs: <strong>{overs}</strong> — Wickets: <strong>{wicketsLimit}</strong>
                </p>
                <p>Batting first: {batOrBowl === "bat" ? player1Name : player2Name}</p>
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
          <div className="batting-info">{battingLabel}</div>
          <button className="settings-btn" onClick={() => setShowSettings(true)}>
            ⚙️
          </button>
        </div>
        <div className="gs-big">
          <div className="gs-player">
            <div className="gs-subtitle">{isPlayer1Batting ? player1Name : player2Name}</div>
            <div className="gs-score">{battingScore}</div>
          </div>
          <div className="gs-vertical-divider"></div>
          <div className="gs-player">
            <div className="gs-subtitle">Wickets</div>
            <div className="gs-score">{wickets}/{wicketsLimit}</div>
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
        {/* Player 1 Side */}
        <div className={`side player-side ${isPlayer1Batting ? "active" : ""}`}>
          <AnimatePresence>
            {player1Hand && (
              <motion.div
                initial={{ x: -100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -100, opacity: 0 }}
                transition={{ duration: 0.4 }}
              >
                <img
                  src={`/images/handfinger${player1Hand}.png`}
                  alt={`P1 hand ${player1Hand}`}
                  className="hand-img"
                />
                <motion.div
                  className="hand-msg player-msg glow-text-enhanced"
                  initial={{ scale: 0.6, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                >
                  {player1Msg || player1Name}
                </motion.div>
                <div className="hand-badge">{player1Name}</div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Center Stage */}
        <div className="center-stage">
          <div className="turn-indicator" style={{ marginBottom: 10 }}>
            {pickPhase === "batter"
              ? `Batter: ${currentBatterName} — Pick a number`
              : `Bowler: ${currentBowlerName} — Pick a number`}
          </div>

          <div className="ball-row">
            {[1,2,3,4,5,6].map((n) => (
              <div className="ball-slot" key={n}>
                <motion.button
                  className="number-ball-btn"
                  onClick={() => handlePick(n)}
                  disabled={buttonsDisabled}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <motion.img
                    src="/images/ball1.png"
                    alt="ball"
                    className="ball-img-enhanced"
                    animate={
                      flyingBall === n
                        ? { y: -300, scale: 1.8, rotate: 1080, opacity: 0 }
                        : { y: 0, scale: 1, rotate: 0, opacity: 1 }
                    }
                    transition={{ duration: 1.2, ease: "easeInOut" }}
                  />
                  <span className="ball-number-label">{n}</span>
                </motion.button>
              </div>
            ))}
          </div>

          <div className="center-result-wrap">
            <AnimatePresence>
              {centerResult && (
                <motion.div
                  key={centerResult + balls}
                  className={`center-result ${centerResult.includes("OUT") ? "out" : "runs"}`}
                  initial={{ scale: 0.3, opacity: 0, rotateY: -90 }}
                  animate={{ scale: 1.1, opacity: 1, rotateY: 0 }}
                  exit={{ scale: 0.3, opacity: 0, rotateY: 90 }}
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
                  animate={{ y: -280, opacity: 0, rotate: 720, scale: 1.5 }}
                  transition={{ duration: 1.2 }}
                >
                  +{scoredRun}
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence>
              {readyText && (
                <motion.div
                  className="ready-text-enhanced"
                  initial={{ scale: 0.6, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.6, opacity: 0 }}
                >
                  ⚡ Get Ready for Next Ball ⚡
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Player 2 Side */}
        <div className={`side computer-side ${!isPlayer1Batting ? "active" : ""}`}>
          <AnimatePresence>
            {player2Hand && (
              <motion.div
                initial={{ x: 100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: 100, opacity: 0 }}
                transition={{ duration: 0.4 }}
              >
                <img
                  src={`/images/handfinger${player2Hand}.png`}
                  alt={`P2 hand ${player2Hand}`}
                  className="hand-img"
                />
                <motion.div
                  className="hand-msg computer-msg glow-text-enhanced"
                  initial={{ scale: 0.6, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                >
                  {player2Msg || player2Name}
                </motion.div>
                <div className="hand-badge">{player2Name}</div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Innings Over / End game */}
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
              initial={{ scale: 0.6, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.6, opacity: 0, y: 50 }}
            >
              <h2>🏏 INNINGS OVER</h2>
              <div className="innings-score">
                Score: {isPlayer1Batting ? player1Score : player2Score}/{wickets}
              </div>

              {inning === 1 && (
                <>
                  <div className="innings-target">
                    Target: {target} runs in {overs} overs
                  </div>
                  <button onClick={startSecondInnings}>Start Second Innings</button>
                </>
              )}

              {inning === 2 && (
                <button
                  onClick={() =>
                    onGameComplete({
                      resultType:
                        player1Score > player2Score ? "victory" : player1Score < player2Score ? "lose" : "draw",
                      playerScore: player1Score,
                      computerScore: player2Score,
                      winMargin: Math.abs(player1Score - player2Score),
                    })
                  }
                >
                  Show Result
                </button>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}