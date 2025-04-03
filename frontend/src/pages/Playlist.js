import React, { useState, useEffect } from "react";
import {
  fetchUserPlaylist,
  updatePlayCount,
  toggleFavorite,
} from "../services/playlistService";
import MusicPlayer from "../components/MusicPlayer";
import "./Playlist.css";
import { useParams } from "react-router-dom";

function Playlist() {
  const [playlist, setPlaylist] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentSong, setCurrentSong] = useState(null);
  const { userId } = useParams();

  const loadPlaylist = async () => {
    try {
      setLoading(true);
      const data = await fetchUserPlaylist(userId);
      setPlaylist(data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPlaylist();
  }, [userId]);

  const refreshPlaylist = async () => {
    console.log("Refreshing playlist...");
    await loadPlaylist();
  };

  const handlePlayTrack = async (track) => {
    try {
      if (track.id) {
        await updatePlayCount(track.id,userId);
      }
      setCurrentSong({
        id: track.id,
        title: track.title,
        artist: track.artist,
        artwork: track.artwork,
        duration: track.duration,
        audio_url: track.url,
      });
    } catch (err) {
      console.error("Error playing track:", err);
    }
  };

  const handleToggleFavorite = async (trackId, isFavorite) => {
    try {
      await toggleFavorite(trackId, !isFavorite,userId);

      setPlaylist((prevPlaylist) => ({
        ...prevPlaylist,
        tracks: prevPlaylist.tracks.map((track) =>
          track.id === trackId ? { ...track, isFavorite: !isFavorite } : track,
        ),
      }));
    } catch (err) {
      console.error("Error toggling favorite:", err);
    }
  };

  if (loading) {
    return <div className="playlist-loading">Loading playlist...</div>;
  }

  if (error) {
    return <div className="playlist-error">{error}</div>;
  }

  return (
    <div className="playlist-container">
      <header className="main-header">
        <div className="logo">Logo</div>
        <nav className="main-nav">
          <div className="nav-item">Playlists</div>
          <div className="nav-item mood-check" onClick={refreshPlaylist}>Mood Check</div>
          <div className="nav-item">Saved</div>
        </nav>
        <div className="user-avatar"></div>
      </header>

      <div className="playlist-box">
        <div className="user-info">
          <div className="user-avatar"></div>
          <div className="username">{playlist?.username}</div>
        </div>

        <h1 className="playlist-title">{playlist?.playlistName}</h1>

        <div className="tracks-container">
          {playlist?.tracks.map((track, index) => (
            <div
              key={track.id}
              className="track-item"
              onClick={() => handlePlayTrack(track)}
            >
              <div className="track-number">{index + 1}</div>
              <div className="track-artwork">
                <img src={track.artwork} alt={`${track.title} artwork`} />
              </div>
              <div className="track-title">{track.title}</div>
              <div className="track-stats">
                <div className="play-count-icon"></div>
                <div className="play-count">{track.playCount}</div>
              </div>
              <div className="track-duration">{track.duration}</div>
              <div
                className={`favorite-button ${track.isFavorite ? "favorite-active" : ""}`}
                onClick={(e) => {
                  e.stopPropagation();
                  handleToggleFavorite(track.id, track.isFavorite);
                }}
              ></div>
            </div>
          ))}
        </div>
      </div>

      {currentSong && <MusicPlayer song={currentSong} />}
    </div>
  );
}

export default Playlist;
