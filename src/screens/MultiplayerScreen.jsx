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

  const generateRoomCode = () => {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  };

  const handleCreateRoom = () => {
    if (!isLoggedIn) {
      alert("Please login first. The login option is at the top-right corner.");
      return;
    }
    setRoomCode(generateRoomCode());
    setIsHost(true);
    setInRoom(true); 
  };

  const handleJoinRoom = () => {
    if (!isLoggedIn) {
      alert("Please login first. The login option is at the top-right corner.");
      return;
    }
    setShowRoomPanel(true); 
  };

  const copyRoomCode = () => {
    navigator.clipboard.writeText(roomCode);
    alert("Room code copied: " + roomCode);
  };

  const handleLogin = (e) => {
    e.preventDefault();
    setIsLoggedIn(true);
    setShowLoginPanel(false);
  };

  const handleSignup = (e) => {
    e.preventDefault();
    setIsLoggedIn(true);
    setShowLoginPanel(false);
  };

  return (
    <div className="multiplayer-container">
      {/* Background */}
      <img src="/images/background2.png" alt="background" className="background" />

      {/* Lights */}
      <img src="/images/stadiumlight.png" alt="light left" className="stadium-lights-left" />
      <img src="/images/stadiumlight1.png" alt="light right" className="stadium-lights-right" />

      {/* Stumps */}
      <img src="/images/stumps1.png" alt="stumps" className="stumps" />

      {/* Sign In Button */}
      <button className="signin-btn" onClick={() => setShowLoginPanel(true)}>
        {isLoggedIn ? "Logout" : "Sign In"}
      </button>

      {/* =================== */}
      {/* LOGIN / SIGNUP PANEL */}
      {/* =================== */}
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

      {/* =================== */}
      {/* MAIN MENU BUTTONS */}
      {/* =================== */}
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

      {/* =================== */}
      {/* ROOM LOBBY */}
      {/* =================== */}
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
            <div className="profile guest">👤 {isHost ? "Waiting..." : "You"}</div>
          </div>

          {isHost ? (
            <div className="settings">
              <label>
                Wickets:
                <select>
                  <option>1</option>
                  <option>3</option>
                  <option>5</option>
                </select>
              </label>
              <label>
                Overs:
                <select>
                  <option>1</option>
                  <option>3</option>
                  <option>5</option>
                </select>
              </label>
              <button className="btn start">Start Match</button>
            </div>
          ) : (
            <p className="waiting">Waiting for host to set settings & start the match...</p>
          )}

          <button className="btn close" onClick={() => setInRoom(false)}>
            ✖ Leave Room
          </button>
        </div>
      )}

      {/* =================== */}
      {/* JOIN ROOM PANEL */}
      {/* =================== */}
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
              setIsHost(false);
              setShowRoomPanel(false);
              setInRoom(true);
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



