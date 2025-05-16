import React, { useState, useEffect, useRef} from "react";
import styles from "./MusicPlayer.module.css";

const MusicPlayer = ({ song, playlist, currentIndex, onChangeSong }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState("00:00");
  const [duration, setDuration] = useState(song?.duration || "00:00");
  const [volume, setVolume] = useState(50);
  const [shuffle, setShuffle] = useState(false);
  const [repeat, setRepeat] = useState(false);
  const [showSongDetails, setShowSongDetails] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [shuffleOrder, setShuffleOrder] = useState([]);
  const [currentShuffleIndex, setCurrentShuffleIndex] = useState(0);
  const audioRef = useRef(null);

  useEffect(() => {
    if (song && audioRef.current) {
      const src = song.audio_url || song.url || "";
      console.log("Setting audio source:", src);
      if (!src || !src.startsWith("http")) {
        console.error("Invalid audio URL:", src);
      }
      audioRef.current.src = src || "";
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

  useEffect(() => {
    if (shuffle && playlist && playlist.length > 0) {
      const indices = Array.from({ length: playlist.length }, (_, i) => i);
      const newOrder = shuffleArray(indices);
      setShuffleOrder(newOrder);
      const idx = newOrder.indexOf(currentIndex);
      setCurrentShuffleIndex(idx !== -1 ? idx : 0);
    } else {
      setShuffleOrder([]);
      setCurrentShuffleIndex(0);
    }
  }, [shuffle, playlist, currentIndex]);
  

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
    if (repeat) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch((err) => console.error(err));
    } else {
      handleNext();
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

  const handleNext = () => {
    if (!playlist || playlist.length === 0) return;
    if (shuffle && shuffleOrder.length > 0) {
      const nextShuffleIndex = (currentShuffleIndex + 1) % playlist.length;
      setCurrentShuffleIndex(nextShuffleIndex);
      const nextIndex = shuffleOrder[nextShuffleIndex];
      onChangeSong(playlist[nextIndex], nextIndex);
    } else {
      const nextIndex = (currentIndex + 1) % playlist.length;
      onChangeSong(playlist[nextIndex], nextIndex);
    }
  };

  const handlePrevious = () => {
    if (!playlist || playlist.length === 0) return;
    if (shuffle && shuffleOrder.length > 0) {
      const prevShuffleIndex =
        (currentShuffleIndex - 1 + playlist.length) % playlist.length;
      setCurrentShuffleIndex(prevShuffleIndex);
      const prevIndex = shuffleOrder[prevShuffleIndex];
      onChangeSong(playlist[prevIndex], prevIndex);
    } else {
      const prevIndex = (currentIndex - 1 + playlist.length) % playlist.length;
      onChangeSong(playlist[prevIndex], prevIndex);
    }
  };

  const shuffleArray = (array) => {
    let arr = array.slice();
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
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
        <div className={styles.songDetailsModal}>
          <button className={styles.closeModalBtn} onClick={toggleSongDetails}>
            ✕
          </button>
          <div className={styles.modalArtwork}>
            <img src={song.artwork} alt="Song artwork" />
          </div>
          <div className={styles.modalInfo}>
            <h2>{song.title}</h2>
            <p>{song.artist}</p>
          </div>
          <div className={styles.modalControls}>
            <button
              className={`${styles.shuffleBtn} ${shuffle ? styles.active : ""}`}
              onClick={toggleShuffle}
            >
              <i className="fa-solid fa-random"></i>
            </button>
            <button className={styles.prevBtn} onClick={handlePrevious}>⏮</button>
            <button className={styles.playBtn} onClick={togglePlay}>
              {isPlaying ? "⏸" : "▶"}
            </button>
            <button className={styles.nextBtn} onClick={handleNext}>⏭</button>
            <button
              className={`${styles.repeatBtn} ${repeat ? styles.active : ""}`}
              onClick={toggleRepeat}
            >
              <i className="fa-solid fa-repeat"></i>
            </button>
          </div>
          <div className={styles.modalProgress}>
            <span className={styles.timeCurrent}>{currentTime}</span>
            <div className={styles.progressBar} onClick={updateProgress}>
              <div
                className={styles.progressFill}
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <span className={styles.timeTotal}>{duration}</span>
          </div>
        </div>
      )}

      <div className={`${styles.musicPlayer} ${isCollapsed ? styles.collapsed : ""}`}>
        {!isMobile && (
          <button className={styles.collapseBtn} onClick={toggleCollapse}>
            <span className={`${styles.collapseIcon} ${isCollapsed ? styles.rotated : ""}`}>
              ▼
            </span>
          </button>
        )}

        <div
          className={styles.playerSongInfo}
          onClick={isMobile ? toggleSongDetails : null}
        >
          <div className={styles.songArtwork}>
            <img src={song.artwork} alt="Now playing" />
          </div>
          <div className={styles.songDetails}>
            <div className={styles.songTitle}>{song.title}</div>
            <div className={styles.songArtist}>{song.artist}</div>
          </div>
        </div>

        <div className={styles.playerControls}>
          {!isMobile && (
            <div className={styles.controlButtons}>
              <button
                className={`${styles.shuffleBtn} ${shuffle ? styles.active : ""}`}
                onClick={toggleShuffle}
              >
                <i className="fa-solid fa-random"></i>
              </button>
              <button className={styles.prevBtn} onClick={handlePrevious}>⏮</button>
              <button className={styles.playBtn} onClick={togglePlay}>
                {isPlaying ? "⏸" : "▶"}
              </button>
              <button className={styles.nextBtn} onClick={handleNext}>⏭</button>
              <button
                className={`${styles.repeatBtn} ${repeat ? styles.active : ""}`}
                onClick={toggleRepeat}
              >
                <i className="fa-solid fa-repeat"></i>
              </button>
            </div>
          )}

          <div className={styles.progressContainer}>
            {!isMobile && <span className={styles.timeCurrent}>{currentTime}</span>}
            <div className={styles.progressBar} onClick={updateProgress}>
              <div
                className={styles.progressFill}
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            {!isMobile && <span className={styles.timeTotal}>{duration}</span>}
          </div>
        </div>

        {!isMobile && (
          <div className={styles.volumeControls}>
            <button className={styles.volumeBtn}>🔊</button>
            <input
              type="range"
              min="0"
              max="100"
              value={volume}
              onChange={(e) => updateVolume(e.target.value)}
              className={styles.volumeSlider}
            />
          </div>
        )}

        {isMobile && (
          <button className={ `${styles.playBtn} ${styles.mobilePlayBtn}`} onClick={togglePlay}>
            {isPlaying ? "⏸" : "▶"}
          </button>
        )}
      </div>
    </>
  );
};

export default MusicPlayer;
