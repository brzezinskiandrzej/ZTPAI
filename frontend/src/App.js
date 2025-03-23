import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Playlist from "./pages/Playlist";
import LandingPage from "./components/LandingPage";
import InputDesign from "./pages/InputDesign";

import { Navigate } from "react-router-dom";
import "./App.css";

function App() {
  return (
    <Router>
      <div className="app">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/input" element={<InputDesign />} />
          <Route path="/playlists/:userId" element={<Playlist />} />

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
