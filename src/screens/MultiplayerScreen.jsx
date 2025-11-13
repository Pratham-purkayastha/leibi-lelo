import React, { useState } from "react";
import "./MultiplayerScreen.css";

export default function MultiplayerScreen({ onAction }) {
  const [showRoomPanel, setShowRoomPanel] = useState(false);
  const [inRoom, setInRoom] = useState(false);
  const [isHost, setIsHost] = useState(false);
  const [roomCode, setRoomCode] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLoginPanel, setShowLoginPanel] = useState(false);
  const [isSignup, setIsSignup] = useState(false);

  // NEW: track opponent joined and guest name for local testing
  const [opponentJoined, setOpponentJoined] = useState(false);
  const [guestName, setGuestName] = useState(null);

  // settings
  const [selectedWickets, setSelectedWickets] = useState(1);
  const [selectedOvers, setSelectedOvers] = useState(1);

  const generateRoomCode = () => {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  };

  const handleCreateRoom = () => {
    if (!isLoggedIn) {
      alert("Please login first. The login option is at the top-right corner.");
      return;
    }
    const code = generateRoomCode();
    setRoomCode(code);
    setIsHost(true);
    setInRoom(true);
    setOpponentJoined(false); // host creates room, waiting for guest
    setGuestName(null);
    // save host name if present (optional)
    const savedHost = localStorage.getItem("player1Name");
    if (!savedHost) localStorage.setItem("player1Name", "Host");
  };

  const handleJoinRoom = () => {
    if (!isLoggedIn) {
      alert("Please login first. The login option is at the top-right corner.");
      return;
    }
    setShowRoomPanel(true);
  };

  const copyRoomCode = () => {
    if (!roomCode) return alert("No room code to copy");
    navigator.clipboard.writeText(roomCode);
    alert("Room code copied: " + roomCode);
  };

  const handleLogin = (e) => {
    e.preventDefault();
    setIsLoggedIn(true);
    setShowLoginPanel(false);
    // Optionally save username to localStorage here
    // localStorage.setItem("player1Name", "YourUserName");
  };

  const handleSignup = (e) => {
    e.preventDefault();
    setIsLoggedIn(true);
    setShowLoginPanel(false);
    // Optionally save username to localStorage here
  };

  // Called when the host clicks Start Match
  function handleStartClick() {
    // Save chosen settings so toss screen can access them
    localStorage.setItem("selectedWickets", String(selectedWickets));
    localStorage.setItem("selectedOvers", String(selectedOvers));

    if (opponentJoined) {
      // normal flow: opponent present
      // ensure player names exist in localStorage (fallbacks)
      if (!localStorage.getItem("player1Name")) localStorage.setItem("player1Name", "Player 1");
      if (!localStorage.getItem("player2Name") && guestName) localStorage.setItem("player2Name", guestName);
      if (!localStorage.getItem("player2Name")) localStorage.setItem("player2Name", "Player 2");
      onAction("multiplayerToss");
      return;
    }

    // opponent not joined -> ask user if they want to force-start (local testing)
    const ok = window.confirm(
      "No opponent has joined yet.\nDo you want to FORCE START the match for local testing?\n\n(Choose 'Cancel' to wait for an opponent.)"
    );
    if (ok) {
      // set fallback player names
      if (!localStorage.getItem("player1Name")) localStorage.setItem("player1Name", "Host");
      if (!localStorage.getItem("player2Name")) localStorage.setItem("player2Name", "Player 2");
      onAction("multiplayerToss");
    } else {
      // do nothing, stay in lobby
      return;
    }
  }

  // immediate force-start without confirm (testing only)
  function handleForceStartNow() {
    localStorage.setItem("selectedWickets", String(selectedWickets));
    localStorage.setItem("selectedOvers", String(selectedOvers));
    if (!localStorage.getItem("player1Name")) localStorage.setItem("player1Name", "Host");
    if (!localStorage.getItem("player2Name")) localStorage.setItem("player2Name", "Player 2");
    onAction("multiplayerToss");
  }

  // When a user uses the Join panel and clicks JOIN, mark them as guest
  function handleJoinConfirm() {
    // Real socket implementation should notify host. For local testing:
    setIsHost(false);
    setShowRoomPanel(false);
    setInRoom(true);
    setOpponentJoined(true);
    const name = localStorage.getItem("player2Name") || "Guest";
    setGuestName(name);
    // store guest name
    localStorage.setItem("player2Name", name);
    // If joining a room created by host, you might want to set player1Name from input or saved value
    if (!localStorage.getItem("player1Name")) localStorage.setItem("player1Name", "Player 1");
  }

  return (
    <div className="multiplayer-container">
      {/* Background */}
      <img src="/images/background2.png" alt="background" className="background" />

      {/* Lights (you can remove if not needed) */}
      <img src="/images/stadiumlight.png" alt="light left" className="stadium-lights-left" />
      <img src="/images/stadiumlight1.png" alt="light right" className="stadium-lights-right" />

      {/* Stumps */}
      <img src="/images/stumps1.png" alt="stumps" className="stumps" />

      {/* Sign In Button */}
      <button className="signin-btn" onClick={() => setShowLoginPanel(true)}>
        {isLoggedIn ? "Logout" : "Sign In"}
      </button>

      {/* LOGIN / SIGNUP PANEL */}
      {showLoginPanel && (
        <div className="login-panel">
          <button className="close-login" onClick={() => setShowLoginPanel(false)}>
            ✖
          </button>
          {!isSignup ? (
            <form onSubmit={handleLogin}>
              <h2>Login</h2>
              <input type="text" placeholder="Username" required />
              <input type="password" placeholder="Password" required />
              <button type="submit" className="login-btn">Login</button>
              <p className="switch-text">
                Don’t have an account?{" "}
                <span onClick={() => setIsSignup(true)}>Sign up here</span>
              </p>
            </form>
          ) : (
            <form onSubmit={handleSignup}>
              <h2>Sign Up</h2>
              <input type="text" placeholder="Username" required />
              <input type="password" placeholder="Password" required />
              <input type="password" placeholder="Confirm Password" required />
              <button type="submit" className="login-btn">Sign Up</button>
              <p className="switch-text">
                Already have an account?{" "}
                <span onClick={() => setIsSignup(false)}>Login here</span>
              </p>
            </form>
          )}
        </div>
      )}

      {/* MAIN MENU BUTTONS */}
      {!inRoom && !showRoomPanel && (
        <div className="buttons">
          <button onClick={handleCreateRoom} className="btn create">
            ➕ CREATE ROOM
          </button>
          <button onClick={handleJoinRoom} className="btn join">
            🔑 JOIN ROOM
          </button>
        </div>
      )}

      {/* ROOM LOBBY */}
      {inRoom && (
        <div className="room-lobby">
          <h2>
            Room Code: {roomCode}{" "}
            <button className="copy-btn" onClick={copyRoomCode}>
              📋 Copy
            </button>
          </h2>

          <div className="profiles">
            <div className="profile host">👤 Host</div>
            <div className="profile guest">👤 {opponentJoined ? (guestName || "Guest") : (isHost ? "Waiting..." : "You")}</div>
          </div>

          {isHost ? (
            <div className="settings">
              <label>
                Wickets:
                <select value={selectedWickets} onChange={(e) => setSelectedWickets(Number(e.target.value))}>
                  <option value={1}>1</option>
                  <option value={3}>3</option>
                  <option value={5}>5</option>
                </select>
              </label>
              <label>
                Overs:
                <select value={selectedOvers} onChange={(e) => setSelectedOvers(Number(e.target.value))}>
                  <option value={1}>1</option>
                  <option value={3}>3</option>
                  <option value={5}>5</option>
                </select>
              </label>

              {/* Start Match uses handleStartClick */}
              <button className="btn start" onClick={handleStartClick}>
                Start Match
              </button>
            </div>
          ) : (
            <p className="waiting">Waiting for host to set settings & start the match...</p>
          )}

          <button className="btn close" onClick={() => setInRoom(false)}>
            ✖ Leave Room
          </button>

          {/* Force start quick test (remove later) */}
          <div style={{ marginTop: 12, textAlign: "center" }}>
            <button onClick={handleForceStartNow} style={{
              padding: "8px 12px",
              background: "#f6b93b",
              border: "none",
              borderRadius: 8,
              cursor: "pointer",
              fontWeight: 700
            }}>
              Force Start Now (test)
            </button>
            <div style={{ fontSize: 12, color: "#6b7c86", marginTop: 6 }}>
              Use this to jump to toss screen for local testing (remove when sockets ready).
            </div>
          </div>
        </div>
      )}

      {/* JOIN ROOM PANEL */}
      {showRoomPanel && (
        <div className="room-panel show">
          <h2>Enter Room Code</h2>
          <div className="input-box">
            <input
              type="text"
              placeholder="AB12CD"
              value={roomCode}
              onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
            />
          </div>
          <button
            className="btn join"
            onClick={() => {
              // When a user joins via this panel we mark them as guest and mark opponent joined
              setIsHost(false);
              setShowRoomPanel(false);
              setInRoom(true);
              setOpponentJoined(true);
              setGuestName(localStorage.getItem("player2Name") || "Guest");
              // ensure player names saved locally
              if (!localStorage.getItem("player2Name")) localStorage.setItem("player2Name", "Guest");
              if (!localStorage.getItem("player1Name")) localStorage.setItem("player1Name", "Player 1");
            }}
          >
            JOIN
          </button>
          <button className="btn close" onClick={() => setShowRoomPanel(false)}>
            ✖ Close
          </button>
        </div>
      )}
    </div>
  );
}



