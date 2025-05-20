import React, { useState, useEffect } from "react";
import "./AdminPanel.css";

function AdminPanel() {
  const [activeTab, setActiveTab] = useState("users");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [users, setUsers] = useState([]);
  const [playlists, setPlaylists] = useState([]);
  const [logs, setLogs] = useState([]);
  const [showUserDetails, setShowUserDetails] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [sortBy, setSortBy] = useState("date");
  const [sortOrder, setSortOrder] = useState("desc");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    init();
  }, []);

  async function init() {
    try {
      setIsLoading(true);
      // Simulated API calls
      setUsers([
        {
          id: "001",
          name: "John Doe",
          email: "john@example.com",
          registrationDate: "2024-01-20",
          playlistCount: 5,
        },
        {
          id: "002",
          name: "Jane Smith",
          email: "jane@example.com",
          registrationDate: "2024-01-19",
          playlistCount: 3,
        },
      ]);
      setPlaylists([
        {
          id: "1",
          name: "Summer Hits",
          owner: "Jane Smith",
          songCount: 24,
          created: "2024-01-15",
        },
        {
          id: "2",
          name: "Workout Mix",
          owner: "John Doe",
          songCount: 15,
          created: "2024-01-18",
        },
      ]);
      setLogs([
        {
          id: "1",
          mood: "Feeling energetic and upbeat",
          aiDetection: "Happy, Excited",
          timestamp: "2024-01-20 14:30",
        },
      ]);
    } catch (err) {
      setError("Failed to load data");
    } finally {
      setIsLoading(false);
    }
  }

  function handleTabChange(tab) {
    setActiveTab(tab);
    setSelectedUser(null);
    setShowUserDetails(false);
  }

  function handleKeyDown(event, callback) {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      callback();
    }
  }

  function handleModalKeyDown(event) {
    if (event.key === "Escape") {
      closeUserDetails();
    }
  }

  function closeUserDetails() {
    setSelectedUser(null);
    setShowUserDetails(false);
  }

  function toggleMobileMenu(isOpen) {
    setMobileMenuOpen(isOpen);
  }

  function toggleSortOrder() {
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    sortPlaylists();
  }

  function handleSortBy(field) {
    setSortBy(field);
    sortPlaylists();
  }

  function sortPlaylists() {
    const sorted = [...playlists].sort((a, b) => {
      const factor = sortOrder === "asc" ? 1 : -1;
      switch (sortBy) {
        case "name":
          return factor * a.name.localeCompare(b.name);
        case "songs":
          return factor * (a.songCount - b.songCount);
        default:
          return (
            factor * new Date(b.created).getTime() -
            new Date(a.created).getTime()
          );
      }
    });
    setPlaylists(sorted);
  }

  async function banUser(userId) {
    try {
      // Simulated API call
      setUsers(users.filter((user) => user.id !== userId));
    } catch (err) {
      setError("Failed to ban user");
    }
  }

  async function resetPassword(userId) {
    try {
      // Simulated API call
      console.log("Password reset for user:", userId);
    } catch (err) {
      setError("Failed to reset password");
    }
  }

  async function deletePlaylist(playlistId) {
    try {
      // Simulated API call
      setPlaylists(playlists.filter((playlist) => playlist.id !== playlistId));
    } catch (err) {
      setError("Failed to delete playlist");
    }
  }

  function showUserPlaylistCount(user) {
    setSelectedUser(user);
    setShowUserDetails(true);
  }

  // Desktop view
  return (
    <div className="admin-panel">
      <h1 className="admin-panel-title">Admin Panel</h1>

      {error && <div className="admin-error-message">{error}</div>}

      <div className="admin-tabs">
        <button
          className={`admin-tab ${activeTab === "users" ? "active" : ""}`}
          onClick={() => handleTabChange("users")}
        >
          Users
        </button>
        <button
          className={`admin-tab ${activeTab === "playlists" ? "active" : ""}`}
          onClick={() => handleTabChange("playlists")}
        >
          Playlists
        </button>
        <button
          className={`admin-tab ${activeTab === "logs" ? "active" : ""}`}
          onClick={() => handleTabChange("logs")}
        >
          Logs
        </button>
      </div>

      {isLoading ? (
        <div className="admin-loading">Loading...</div>
      ) : (
        <>
          {/* Users Tab */}
          {activeTab === "users" && (
            <div className="admin-content">
              <h2 className="admin-section-title">User Management</h2>
              <div className="admin-user-grid">
                {users.map((user) => (
                  <div key={user.id} className="admin-user-card">
                    <div className="admin-user-id">
                      <span>ID: </span>
                      <span>{user.id}</span>
                    </div>
                    <div className="admin-user-field">
                      <div className="admin-field-label">Name</div>
                      <div className="admin-field-value">{user.name}</div>
                    </div>
                    <div className="admin-user-field">
                      <div className="admin-field-label">Email</div>
                      <div className="admin-field-value">{user.email}</div>
                    </div>
                    <div className="admin-user-field">
                      <div className="admin-field-label">Registration Date</div>
                      <div className="admin-field-value">
                        {user.registrationDate}
                      </div>
                    </div>
                    <div className="admin-user-actions">
                      <button
                        className="admin-view-details-btn"
                        onClick={() => showUserPlaylistCount(user)}
                      >
                        View Details
                      </button>
                      <button
                        className="admin-ban-user-btn"
                        onClick={() => banUser(user.id)}
                      >
                        Ban User
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Playlists Tab */}
          {activeTab === "playlists" && (
            <div className="admin-content">
              <h2 className="admin-section-title">Playlist Management</h2>
              <div className="admin-sort-controls">
                <div className="admin-sort-by">
                  <span>Sort by:</span>
                  <button
                    className={`admin-sort-btn ${sortBy === "date" ? "active" : ""}`}
                    onClick={() => handleSortBy("date")}
                  >
                    Date
                  </button>
                  <button
                    className={`admin-sort-btn ${sortBy === "name" ? "active" : ""}`}
                    onClick={() => handleSortBy("name")}
                  >
                    Name
                  </button>
                  <button
                    className={`admin-sort-btn ${sortBy === "songs" ? "active" : ""}`}
                    onClick={() => handleSortBy("songs")}
                  >
                    Songs
                  </button>
                </div>
                <button
                  className="admin-sort-order-btn"
                  onClick={toggleSortOrder}
                >
                  {sortOrder === "asc" ? "↑ Ascending" : "↓ Descending"}
                </button>
              </div>
              <div className="admin-playlist-grid">
                {playlists.map((playlist) => (
                  <div key={playlist.id} className="admin-playlist-card">
                    <div className="admin-playlist-header">
                      <h3 className="admin-playlist-name">{playlist.name}</h3>
                      <span className="admin-playlist-songs">
                        {playlist.songCount} songs
                      </span>
                    </div>
                    <div className="admin-playlist-info">
                      <div className="admin-playlist-owner">
                        Owner: {playlist.owner}
                      </div>
                      <div className="admin-playlist-date">
                        Created: {playlist.created}
                      </div>
                    </div>
                    <button
                      className="admin-delete-playlist-btn"
                      onClick={() => deletePlaylist(playlist.id)}
                    >
                      Delete Playlist
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Logs Tab */}
          {activeTab === "logs" && (
            <div className="admin-content">
              <h2 className="admin-section-title">System Logs</h2>
              <div className="admin-logs-list">
                {logs.map((log) => (
                  <div key={log.id} className="admin-log-entry">
                    <div className="admin-log-timestamp">{log.timestamp}</div>
                    <div className="admin-log-mood">
                      <span className="admin-log-label">Mood:</span> {log.mood}
                    </div>
                    <div className="admin-log-detection">
                      <span className="admin-log-label">AI Detection:</span>{" "}
                      {log.aiDetection}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {/* Mobile User Cards */}
      <div className="admin-mobile-users">
        {users.map((user) => (
          <div key={user.id} className="admin-mobile-user-card">
            <div className="admin-mobile-user-id">
              <span>ID: </span>
              <span>{user.id}</span>
            </div>
            <div className="admin-mobile-user-field">
              <div className="admin-mobile-field-label">Name</div>
              <div className="admin-mobile-field-value">{user.name}</div>
            </div>
            <div className="admin-mobile-user-field">
              <div className="admin-mobile-field-label">Email</div>
              <div className="admin-mobile-field-value">{user.email}</div>
            </div>
            <div className="admin-mobile-user-field">
              <div className="admin-mobile-field-label">Registration Date</div>
              <div className="admin-mobile-field-value">
                {user.registrationDate}
              </div>
            </div>
            <div className="admin-mobile-user-actions">
              <button
                className="admin-mobile-view-details-btn"
                onClick={() => showUserPlaylistCount(user)}
              >
                View Details
              </button>
              <button
                className="admin-mobile-ban-user-btn"
                onClick={() => banUser(user.id)}
              >
                Ban User
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* User Details Modal */}
      {showUserDetails && selectedUser && (
        <div
          className="admin-modal-overlay"
          onClick={closeUserDetails}
          onKeyDown={handleModalKeyDown}
          tabIndex={0}
        >
          <div
            className="admin-modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <button className="admin-modal-close" onClick={closeUserDetails}>
              ×
            </button>
            <h2 className="admin-modal-title">{selectedUser.name}</h2>
            <div className="admin-modal-info">
              <div className="admin-modal-field">
                <span className="admin-modal-label">Email:</span>
                <span className="admin-modal-value">{selectedUser.email}</span>
              </div>
              <div className="admin-modal-field">
                <span className="admin-modal-label">Registration Date:</span>
                <span className="admin-modal-value">
                  {selectedUser.registrationDate}
                </span>
              </div>
              <div className="admin-modal-field">
                <span className="admin-modal-label">Playlist Count:</span>
                <span className="admin-modal-value">
                  {selectedUser.playlistCount}
                </span>
              </div>
            </div>
            <div className="admin-modal-actions">
              <button
                className="admin-modal-reset-btn"
                onClick={() => resetPassword(selectedUser.id)}
              >
                Reset Password
              </button>
              <button
                className="admin-modal-ban-btn"
                onClick={() => {
                  banUser(selectedUser.id);
                  closeUserDetails();
                }}
              >
                Ban User
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminPanel;
