import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Playlist from "./pages/Playlist";
import LandingPage from "./components/LandingPage";
import InputDesign from "./pages/InputDesign";
import MyAccount from "./components/MyAccount";
import LoginRegistration from "./pages/LoginRegistration";
// Note: These components would need to be created
import { Navigate } from "react-router-dom";
import "./App.css";

function App() {
  return (
    <Router>
      <div className="app">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/playlists/:userId" element={<Playlist />} />
          <Route path="/input" element={<InputDesign />} />
          <Route path="/account" element={<MyAccount />} />
          <Route path="/login" element={<LoginRegistration />} />
          <Route
            path="/mood-check"
            element={
              <div className="placeholder-page">
                Mood Check Page (To be implemented)
              </div>
            }
          />
          <Route
            path="/saved"
            element={
              <div className="placeholder-page">
                Saved Tracks Page (To be implemented)
              </div>
            }
          />
          <Route
            path="/profile"
            element={
              <div className="placeholder-page">
                User Profile Page (To be implemented)
              </div>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
