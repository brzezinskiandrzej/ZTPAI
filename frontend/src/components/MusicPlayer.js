import React, { useState, useEffect } from "react";
import "./MusicPlayer.css";

const MusicPlayer = ({ song }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState("00:00");
  const [duration, setDuration] = useState(song?.duration || "00:00");
  const [volume, setVolume] = useState(50);
  const [shuffle, setShuffle] = useState(false);
  const [repeat, setRepeat] = useState(false);
  const [showSongDetails, setShowSongDetails] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    // Reset player state when a new song is loaded
    if (song) {
      setIsPlaying(true);
      setProgress(0);
      setCurrentTime("00:00");
      setDuration(song.duration);
    }
  }, [song]);

  // Simulate time progress when playing
  useEffect(() => {
    let interval;
    if (isPlaying) {
      interval = setInterval(() => {
        // This is a simplified simulation
        // In a real app, this would sync with the actual audio element
        setProgress((prev) => {
          if (prev >= 100) {
            setIsPlaying(false);
            clearInterval(interval);
            return 100;
          }
          return prev + 0.5;
        });

        // Update current time based on progress
        const durationSecs = convertTimeToSeconds(duration);
        const currentSecs = Math.floor((durationSecs * progress) / 100);
        setCurrentTime(formatTime(currentSecs));
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isPlaying, duration]);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const toggleSongDetails = () => {
    setShowSongDetails(!showSongDetails);
  };

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  const updateProgress = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = (x / rect.width) * 100;
    setProgress(Math.min(Math.max(percentage, 0), 100));

    // Update current time based on new progress
    const durationSecs = convertTimeToSeconds(duration);
    const currentSecs = Math.floor((durationSecs * percentage) / 100);
    setCurrentTime(formatTime(currentSecs));
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

  // Helper function to convert time format (e.g., "3:45") to seconds
  const convertTimeToSeconds = (timeString) => {
    if (!timeString) return 0;
    const [minutes, seconds] = timeString.split(":").map(Number);
    return minutes * 60 + seconds;
  };

  // Helper function to format seconds to "mm:ss"
  const formatTime = (totalSeconds) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  // If no song is selected, don't render the player
  if (!song) return null;

  const isMobile = window.innerWidth <= 640;

  return (
    <>
      {showSongDetails && (
        <div className="song-details-modal">
          <button className="close-modal-btn" onClick={toggleSongDetails}>
            ✕
          </button>
          <div className="modal-artwork">
            <img src={song.artwork} alt="Song artwork" />
          </div>
          <div className="modal-info">
            <h2>{song.title}</h2>
            <p>{song.artist}</p>
          </div>
          <div className="modal-controls">
            <button
              className={`shuffle-btn ${shuffle ? "active" : ""}`}
              onClick={toggleShuffle}
            >
              🔀
            </button>
            <button className="prev-btn">⏮</button>
            <button className="play-btn" onClick={togglePlay}>
              {isPlaying ? "⏸" : "▶"}
            </button>
            <button className="next-btn">⏭</button>
            <button
              className={`repeat-btn ${repeat ? "active" : ""}`}
              onClick={toggleRepeat}
            >
              🔁
            </button>
          </div>
          <div className="modal-progress">
            <span className="time-current">{currentTime}</span>
            <div className="progress-bar" onClick={updateProgress}>
              <div
                className="progress-fill"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <span className="time-total">{duration}</span>
          </div>
        </div>
      )}

      <div className={`music-player ${isCollapsed ? "collapsed" : ""}`}>
        {!isMobile && (
          <button className="collapse-btn" onClick={toggleCollapse}>
            <span className={`collapse-icon ${isCollapsed ? "rotated" : ""}`}>
              ▼
            </span>
          </button>
        )}

        <div
          className="player-song-info"
          onClick={isMobile ? toggleSongDetails : null}
        >
          <div className="song-artwork">
            <img src={song.artwork} alt="Now playing" />
          </div>
          <div className="song-details">
            <div className="song-title">{song.title}</div>
            <div className="song-artist">{song.artist}</div>
          </div>
        </div>

        <div className="player-controls">
          {!isMobile && (
            <div className="control-buttons">
              <button
                className={`shuffle-btn ${shuffle ? "active" : ""}`}
                onClick={toggleShuffle}
              >
                🔀
              </button>
              <button className="prev-btn">⏮</button>
              <button className="play-btn" onClick={togglePlay}>
                {isPlaying ? "⏸" : "▶"}
              </button>
              <button className="next-btn">⏭</button>
              <button
                className={`repeat-btn ${repeat ? "active" : ""}`}
                onClick={toggleRepeat}
              >
                🔁
              </button>
            </div>
          )}

          <div className="progress-container">
            {!isMobile && <span className="time-current">{currentTime}</span>}
            <div className="progress-bar" onClick={updateProgress}>
              <div
                className="progress-fill"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            {!isMobile && <span className="time-total">{duration}</span>}
          </div>
        </div>

        {!isMobile && (
          <div className="volume-controls">
            <button className="volume-btn">🔊</button>
            <input
              type="range"
              min="0"
              max="100"
              value={volume}
              onChange={(e) => updateVolume(e.target.value)}
              className="volume-slider"
            />
          </div>
        )}

        {isMobile && (
          <button className="play-btn mobile-play-btn" onClick={togglePlay}>
            {isPlaying ? "⏸" : "▶"}
          </button>
        )}
      </div>
    </>
  );
};

export default MusicPlayer;
