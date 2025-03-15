import React, { useState, useEffect } from "react";
import "./MusicPlayer.css";

const MusicPlayer = ({ playlist = [], username = "User" }) => {
  const [currentSong, setCurrentSong] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState("00:00");
  const [duration, setDuration] = useState("00:00");
  const [volume, setVolume] = useState(50);
  const [shuffle, setShuffle] = useState(false);
  const [repeat, setRepeat] = useState(false);
  const [showSongDetails, setShowSongDetails] = useState(false);
  const [progress, setProgress] = useState(0);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const selectSong = (song) => {
    setCurrentSong(song);
    setIsPlaying(true);
    setProgress(0);
    setDuration(song.duration || "00:00");
  };

  const toggleSongDetails = () => {
    setShowSongDetails(!showSongDetails);
  };

  const updateProgress = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = (x / rect.width) * 100;
    setProgress(Math.min(Math.max(percentage, 0), 100));
  };

  const toggleShuffle = () => {
    setShuffle(!shuffle);
  };

  const toggleRepeat = () => {
    setRepeat(!repeat);
  };

  const updateVolume = (value) => {
    setVolume(value);
  };

  // Simulate time progress when playing
  useEffect(() => {
    let interval;
    if (isPlaying && currentSong) {
      interval = setInterval(() => {
        // Convert duration string to seconds
        const durationParts = currentSong.duration.split(":");
        const durationInSeconds =
          parseInt(durationParts[0]) * 60 + parseInt(durationParts[1]);

        // Calculate current time based on progress
        const currentTimeInSeconds = Math.floor(
          (progress / 100) * durationInSeconds,
        );
        const minutes = Math.floor(currentTimeInSeconds / 60);
        const seconds = currentTimeInSeconds % 60;

        setCurrentTime(
          `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`,
        );
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, progress, currentSong]);

  return (
    <div className="music-player">
      <div className="player-container">
        <header className="player-header">
          <div className="logo">Logo</div>
          <nav className="nav-menu">
            <div className="nav-item">Playlists</div>
            <div className="nav-item mood-check">Mood Check</div>
            <div className="nav-item">Saved</div>
          </nav>
          <div className="user-avatar"></div>
        </header>

        <main className="player-content">
          <div className="user-info">
            <div className="user-avatar"></div>
            <div className="username">{username}</div>
          </div>

          <h1 className="playlist-title">Your Today's Moody Playlist</h1>

          <div className="playlist-container">
            {playlist.map((song, index) => (
              <div
                key={index}
                className={`playlist-item ${currentSong && currentSong.id === song.id ? "active" : ""}`}
                onClick={() => selectSong(song)}
              >
                <div className="track-number">{index + 1}</div>
                <div className="track-artwork">
                  <img src={song.artwork} alt={`${song.title} artwork`} />
                </div>
                <div className="track-title">{song.title}</div>
                <div className="track-stats">
                  <div className="play-count-icon"></div>
                  <div className="play-count">{song.playCount}</div>
                </div>
                <div className="track-duration">{song.duration}</div>
                <div className="track-favorite"></div>
              </div>
            ))}
          </div>
        </main>
      </div>

      {showSongDetails && currentSong && (
        <div className="song-details-overlay">
          <button onClick={toggleSongDetails} className="close-button">
            ✕
          </button>
          <div className="song-artwork">
            <img
              src={currentSong.artwork}
              alt={`${currentSong.title} artwork`}
            />
          </div>
          <div className="song-info">
            <h2 className="song-title">{currentSong.title}</h2>
            <p className="song-artist">{currentSong.artist}</p>
          </div>
          <div className="song-controls">
            <div className="control-buttons">
              <button
                onClick={toggleShuffle}
                className={`shuffle-button ${shuffle ? "active" : ""}`}
              >
                🔀
              </button>
              <button className="prev-button">⏮</button>
              <button onClick={togglePlay} className="play-button">
                {isPlaying ? "⏸" : "▶"}
              </button>
              <button className="next-button">⏭</button>
              <button
                onClick={toggleRepeat}
                className={`repeat-button ${repeat ? "active" : ""}`}
              >
                🔁
              </button>
            </div>
            <div className="progress-container">
              <span className="current-time">{currentTime}</span>
              <div className="progress-bar" onClick={updateProgress}>
                <div
                  className="progress-fill"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              <span className="duration">{currentSong.duration}</span>
            </div>
          </div>
        </div>
      )}

      {currentSong && (
        <div className="player-bar">
          <div className="now-playing">
            <div className="now-playing-artwork">
              <img
                src={currentSong.artwork}
                alt={`${currentSong.title} artwork`}
              />
            </div>
            <div
              className="now-playing-info"
              onClick={() => {
                if (window.innerWidth <= 640) {
                  toggleSongDetails();
                }
              }}
            >
              <div className="now-playing-title">{currentSong.title}</div>
              <div className="now-playing-artist">{currentSong.artist}</div>
            </div>
          </div>

          <div className="player-controls">
            <div className="control-buttons desktop-only">
              <button
                onClick={toggleShuffle}
                className={`shuffle-button ${shuffle ? "active" : ""}`}
              >
                🔀
              </button>
              <button className="prev-button">⏮</button>
              <button onClick={togglePlay} className="play-button">
                {isPlaying ? "⏸" : "▶"}
              </button>
              <button className="next-button">⏭</button>
              <button
                onClick={toggleRepeat}
                className={`repeat-button ${repeat ? "active" : ""}`}
              >
                🔁
              </button>
            </div>
            <div className="progress-container">
              <span className="current-time desktop-only">{currentTime}</span>
              <div className="progress-bar" onClick={updateProgress}>
                <div
                  className="progress-fill"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              <span className="duration desktop-only">{duration}</span>
            </div>
          </div>

          <div className="volume-controls desktop-only">
            <button className="volume-icon">🔊</button>
            <input
              type="range"
              min="0"
              max="100"
              value={volume}
              onChange={(e) => updateVolume(e.target.value)}
              className="volume-slider"
            />
          </div>

          {window.innerWidth <= 640 && (
            <button onClick={togglePlay} className="play-button mobile-only">
              {isPlaying ? "⏸" : "▶"}
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default MusicPlayer;
