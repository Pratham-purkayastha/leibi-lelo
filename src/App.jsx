import React, { useState } from "react";
import HomeScreen from "./components/HomeScreen";        // still in components
import MultiplayerScreen from "./screens/MultiplayerScreen";  // in screens
import TossScreen from "./screens/TossScreen";           // new import
import GameScreen from "./screens/GameScreen";           // added import

function App() {
  const [screen, setScreen] = useState("home");
  const [gameSettings, setGameSettings] = useState(null); // NEW: store overs, wickets, bat/bowl

  return (
    <>
      {screen === "home" && <HomeScreen onAction={setScreen} />}
      {screen === "multiplayer" && <MultiplayerScreen onAction={setScreen} />}
      {screen === "toss" && (
        <TossScreen
          onAction={setScreen}
          setGameSettings={setGameSettings} // pass setter
        />
      )}

      {screen === "game" && (
        <GameScreen
          onAction={setScreen}
          gameSettings={gameSettings} // pass settings down
        />
      )}
    </>
  );
}

export default App;



