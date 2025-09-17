import React, { useState } from "react";
import HomeScreen from "./components/HomeScreen";        // still in components
import MultiplayerScreen from "./screens/MultiplayerScreen";  // in screens
import TossScreen from "./screens/TossScreen";           // new import

function App() {
  const [screen, setScreen] = useState("home");

  return (
    <>
      {screen === "home" && <HomeScreen onAction={setScreen} />}
      {screen === "multiplayer" && <MultiplayerScreen onAction={setScreen} />}
      {screen === "toss" && <TossScreen onAction={setScreen} />}

      {/* 👇 Dummy placeholder screen for now */}
      {screen === "game" && (
        <div
          style={{
            color: "white",
            fontSize: "32px",
            textAlign: "center",
            marginTop: "200px",
          }}
        >
          ⏳ Waiting for the Next Screen...
        </div>
      )}
    </>
  );
}

export default App;


