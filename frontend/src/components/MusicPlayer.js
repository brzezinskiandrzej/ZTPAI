import React, { useState, useEffect, useRef} from "react";
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
  const audioRef = useRef(null);

  useEffect(() => {
    if (song && audioRef.current) {
      console.log("Setting audio source:", song.audio_url);
      if (!song.audio_url || !song.audio_url.startsWith("http")) {
        console.error("Invalid audio URL:", song.audio_url);
      }
      audioRef.current.src = song.audio_url || "";
      audioRef.current.currentTime = 0;
      setIsPlaying(true);
      setProgress(0);
      setCurrentTime("00:00");
      setDuration(song.duration || "00:00");
    }
  }, [song]);

  
  useEffect(() => {
    if (!audioRef.current) return;
    audioRef.current.volume = volume / 100;
  }, [volume]);

  useEffect(() => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.play().catch((err) => console.error("Play error:", err));
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying]);
  

  const handleTimeUpdate = () => {
    if (!audioRef.current) return;
    const cur = audioRef.current.currentTime;
    const dur = audioRef.current.duration;

    if (!isNaN(dur) && dur > 0) {
      setProgress((cur / dur) * 100);
      setCurrentTime(formatTime(Math.floor(cur)));
    }
  };

  const handleLoadedMetadata = () => {
    if (!audioRef.current) return;
    const dur = audioRef.current.duration;
    if (!isNaN(dur) && dur > 0) {
      setDuration(formatTime(Math.floor(dur)));
    }
  };

  const handleEnded = () => {
    if (repeat && audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch((err) => console.error(err));
    } else {
      setIsPlaying(false);
    }
  };
  const handleAudioError = () => {
    if (!audioRef.current) return;
    const error = audioRef.current.error;
    console.error("Audio element error:", error);
  };

  const formatTime = (sec) => {
    const minutes = Math.floor(sec / 60);
    const seconds = sec % 60;
    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  };

  const updateProgress = (e) => {
    if (!audioRef.current) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = (x / rect.width) * 100;
    const newProgress = Math.min(Math.max(percentage, 0), 100);
    setProgress(newProgress);

    const dur = audioRef.current.duration;
    if (!isNaN(dur) && dur > 0) {
      const newTime = (dur * newProgress) / 100;
      audioRef.current.currentTime = newTime;
      setCurrentTime(formatTime(Math.floor(newTime)));
    }
  };

  const togglePlay = () => {
    setIsPlaying((prev) => !prev);
  };
  const toggleSongDetails = () => {
    setShowSongDetails((prev) => !prev);
  };
  const toggleCollapse = () => {
    setIsCollapsed((prev) => !prev);
  };
  const toggleShuffle = () => {
    setShuffle((prev) => !prev);
  };
  const toggleRepeat = () => {
    setRepeat((prev) => !prev);
  };
  const updateVolume = (value) => {
    setVolume(value);
  };

  

  if (!song) return null;

  const isMobile = window.innerWidth <= 640;

  return (
    <>
      <audio
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleEnded}
        onError={handleAudioError}
      />
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
