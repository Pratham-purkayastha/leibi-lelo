import React, { useState } from "react";
import HomeScreen from "./components/HomeScreen";
import MultiplayerScreen from "./screens/MultiplayerScreen";
import TossScreen from "./screens/TossScreen";
import MultiplayerTossScreen from "./screens/MultiplayerTossScreen";
import GameScreen from "./screens/GameScreen";
import MultiplayerGameScreen from "./screens/MultiplayerGameScreen";
import ResultScreen from "./screens/ResultScreen";
import Leaderboard from "./screens/Leaderboard";
import IntroScreen from "./screens/IntroScreen";

function App() {
  const [screen, setScreen] = useState("intro");
  const [gameSettings, setGameSettings] = useState(null);
  const [multiGameSettings, setMultiGameSettings] = useState(null);
  const [gameResult, setGameResult] = useState(null);

  const handleGameComplete = (resultData) => {
    setGameResult(resultData);
    setScreen("result");
  };

  const handleBackToHome = () => {
    setScreen("home");
    setGameSettings(null);
    setMultiGameSettings(null);
    setGameResult(null);
  };

  const handlePlayAgain = () => {
    setGameResult(null);
    setScreen("toss");
  };

  const handleLeaderboard = () => setScreen("leaderboard");
  const handleBackToResult = () => setScreen("result");

  // ✅ called by MultiplayerTossScreen after toss
  const handleMultiplayerGameStart = (settings) => {
    setMultiGameSettings(settings);
    setScreen("multiplayerGame");
  };

  return (
    <>
      {screen === "intro" && <IntroScreen onStart={() => setScreen("home")} />}

      {screen === "home" && <HomeScreen onAction={setScreen} />}

      {screen === "multiplayer" && <MultiplayerScreen onAction={setScreen} />}

      {/* ✅ single player toss */}
      {screen === "toss" && (
        <TossScreen
          onAction={setScreen}
          setGameSettings={setGameSettings}
        />
      )}

      {/* ✅ multiplayer toss */}
      {screen === "multiplayerToss" && (
        <MultiplayerTossScreen
          onAction={setScreen}
          setGameSettings={handleMultiplayerGameStart} // this triggers MultiplayerGameScreen
        />
      )}

      {/* ✅ single player game */}
      {screen === "game" && (
        <GameScreen
          onAction={setScreen}
          gameSettings={gameSettings}
          onGameComplete={handleGameComplete}
        />
      )}

      {/* ✅ multiplayer game */}
      {screen === "multiplayerGame" && (
        <MultiplayerGameScreen
          onAction={setScreen}
          gameSettings={multiGameSettings}
          onGameComplete={handleGameComplete}
        />
      )}

      {/* ✅ result screen */}
      {screen === "result" && gameResult && (
        <ResultScreen
          resultType={gameResult.resultType}
          playerScore={gameResult.playerScore}
          computerScore={gameResult.computerScore}
          winMargin={gameResult.winMargin}
          onBackToHome={handleBackToHome}
          onPlayAgain={handlePlayAgain}
          onLeaderboard={handleLeaderboard}
        />
      )}

      {screen === "leaderboard" && (
        <Leaderboard onBackToResult={handleBackToResult} />
      )}
    </>
  );
}

export default App;
