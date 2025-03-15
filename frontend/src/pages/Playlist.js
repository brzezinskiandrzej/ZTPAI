import React, { useState, useEffect } from "react";
import MusicPlayer from "../components/MusicPlayer";
import { fetchUserPlaylist } from "../services/playlistService";

const Playlist = () => {
  const [playlist, setPlaylist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [username, setUsername] = useState("");

  useEffect(() => {
    const loadPlaylist = async () => {
      try {
        setLoading(true);
        const data = await fetchUserPlaylist();
        setPlaylist(data.tracks || []);
        setUsername(data.username || "User");
        setLoading(false);
      } catch (err) {
        setError("Failed to load playlist. Please try again later.");
        setLoading(false);
        console.error("Error loading playlist:", err);
      }
    };

    loadPlaylist();
  }, []);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading your playlist...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <h2>Oops!</h2>
        <p>{error}</p>
        <button onClick={() => window.location.reload()}>Try Again</button>
      </div>
    );
  }

  return <MusicPlayer playlist={playlist} username={username} />;
};

export default Playlist;
