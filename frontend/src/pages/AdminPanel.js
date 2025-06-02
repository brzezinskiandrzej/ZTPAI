// src/pages/AdminPanel.jsx
import React, { useState, useEffect } from "react";
import "./AdminPanel.css";

import { useNavigate }  from "react-router-dom";
import { useAuth }      from "../context/AuthContext";
import { useAdminApi }   from "../services/adminService";
import { errorTranslations } from "../utils/errorMessages";   // taki sam helper jak w LoginRegistration

export default function AdminPanel() {
  /* ---------- auth / guards ---------- */
  const { user, signout } = useAuth();
  const navigate = useNavigate();
  const api               = useAdminApi();

  useEffect(() => {
    if (!user)               return navigate("/login", { replace:true });
    if (user.role !== "admin") navigate("/",          { replace:true });
  }, [user]);

  /* ---------- state ---------- */
  const [activeTab, setActiveTab]       = useState("users"); // "users" | "playlists" | "logs"
  const [mobileMenuOpen, setMobile]     = useState(false);

  const [users,     setUsers]     = useState([]);
  const [playlists, setPlaylists] = useState([]);
  const [logs,      setLogs]      = useState([]);            // placeholder

  const [showUserDetails, setShowUserDetails] = useState(false);
  const [selectedUser,    setSelectedUser]    = useState(null);

  const [sortBy,    setSortBy]    = useState("date");
  const [sortOrder, setSortOrder] = useState("desc");

  const [isLoading, setLoading] = useState(true);
  const [error,     setError]   = useState(null);
  const [success,   setSuccess] = useState(null);

  /* ---------- initial fetch ---------- */
  useEffect(() => { fetchAll(); }, []);
  useEffect(() => {
    if (error || success) {
      const id = setTimeout(() => { setError(null); setSuccess(null); }, 4000);
      return () => clearTimeout(id);
    }
  }, [error, success]);

  async function fetchAll() {
    try {
      setLoading(true); setError(null);

      const [u, p,l] = await Promise.all([
        api.getUsers(),
        api.getPlaylists(sortBy, sortOrder),
        api.getLogs() 
      ]);
      setUsers(u);
      if (Array.isArray(sortInitial(p))) setPlaylists(sortInitial(p));
      setLogs(l);
    } catch (e) {
      setError(e.data?.error?.message || "Failed to load data");
    } finally { setLoading(false); }
  }

  /* ---------- helpers ---------- */
  function sortInitial(arr) {
    /** sortujemy wg daty malejąco aby zachować wygląd jak wcześniej */
    return [...arr].sort((a,b) =>
      new Date(b.created) - new Date(a.created));
  }

  async function toggleSortOrder() {
    setSortOrder(o => (o === "asc" ? "desc" : "asc"));
    await reloadPlaylists(sortBy, sortOrder === "asc" ? "desc" : "asc");
  }
  async function handleSortBy(field) {
    setSortBy(field);
    await reloadPlaylists(field, sortOrder);
  }
  async function reloadPlaylists(field, dir) {
  try {
    const data = await api.getPlaylists(field, dir);
    setPlaylists(Array.isArray(data) ? data : []);
  } catch (e) {
    setError(e.data?.error?.message || "Failed to load playlists");
  }
}
  

  /* ---------- USERS actions ---------- */
  function showUserPlaylistCount(u) { setSelectedUser(u); setShowUserDetails(true); }
  function closeUserDetails()       { setSelectedUser(null); setShowUserDetails(false); }

  async function banUser(id, currentlyBanned) {
    try {
      const resp = await api.banUser(id, !currentlyBanned);

    setUsers(prev =>
     prev.map(u =>
       u.id === resp.userId ? { ...u, is_banned: resp.isBanned } : u));
      if (selectedUser?.id === resp.userId)
        setSelectedUser(u => ({ ...u, is_banned: resp.isBanned }));

      setSuccess(resp.isBanned ? "User locked ✔" : "User unlocked ✔");
    } catch (e) { setError(e.data?.error?.message || "Failed to change user status"); }
  }

  async function resetPassword(id) {
    const pwd = prompt("Enter new password (min 8 chars):");
    if (!pwd) return;
    try {
      await api.resetPassword(id, pwd);
      alert("Password has been changed ✅");
    } catch (e) { setError(errorTranslations(e).message); }
  }

  /* ---------- PLAYLIST actions ---------- */
  async function deletePlaylist(pid) {
    try {
      await api.deletePlaylist(pid);
      setSuccess("Playlist deleted ✔");
      await reloadPlaylists(sortBy, sortOrder);
    } catch (e) { setError(e.data?.error?.message || "Failed to delete playlist"); }
  }
  async function refreshUsers() {
    try { setUsers(await api.getUsers()); }
    catch (e) { setError(e.data?.error?.message || "Failed to reload users"); }
  }
  function renderDescription(log){
    switch (log.action){
      case "BAN":    return `User #${log.target_id} was banned`;
      case "UNBAN":  return `User #${log.target_id} was un-banned`;
      case "DELETE_PLAYLIST":
        return `Playlist #${log.target_id} was deleted (${log.meta?.playlistName})`;
      case "AI_DETECTION":
        return (
          <>
            Prompt: <i>{log.meta?.prompt.slice(0,60)}…</i><br/>
            Detected mood:&nbsp;<b>{log.meta?.mood}</b>
          </>
        );
      default:       return JSON.stringify(log.meta ?? {});
    }
  }



  /* ---------- UI handlers ---------- */
  const handleTabChange = t => { setActiveTab(t); closeUserDetails(); };
  const toggleMobileMenu = o => setMobile(o);

  /* ---------- RENDER ---------- */
  return (
    <div className="admin-panel">
      <h1 className="admin-panel-title">Admin Panel</h1>

      {error && <div className="admin-error-message">{error}</div>}
      {success && <div className="admin-success-message">{success}</div>}

      {/* ------ tabs ------ */}
      <div className="admin-tabs">
        {["users","playlists","logs"].map(t => (
          <button key={t}
                  className={`admin-tab ${activeTab===t?"active":""}`}
                  onClick={() => handleTabChange(t)}>
            {t.charAt(0).toUpperCase()+t.slice(1)}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="admin-loading">Loading…</div>
      ) : (
      <>
        {/* -------------------- USERS -------------------- */}
        {activeTab==="users" && (
          <div className="admin-content">
            <h2 className="admin-section-title">User Management</h2>
            <div className="admin-user-grid">
              {users.map(u => (
                <div key={u.id}
                     className={`admin-user-card ${u.is_banned?"banned":""}`}>
                  <div className="admin-user-id">
                    <span>ID: </span><span>{u.id}</span>
                  </div>

                  <div className="admin-user-field">
                    <div className="admin-field-label">Username</div>
                    <div className="admin-field-value">{u.username}</div>
                  </div>
                  <div className="admin-user-field">
                    <div className="admin-field-label">Email</div>
                    <div className="admin-field-value">{u.email}</div>
                  </div>
                  <div className="admin-user-field">
                    <div className="admin-field-label">Registration Date</div>
                    <div className="admin-field-value">
                      {new Date(u.created).toLocaleDateString()}
                    </div>
                  </div>

                  <div className="admin-user-actions">
                    <button className="admin-view-details-btn"
                            onClick={()=>showUserPlaylistCount(u)}>
                      View Details
                    </button>
                    <button className="admin-ban-user-btn"
                            disabled={false}
                            onClick={()=>banUser(u.id, u.is_banned)}>
                      {u.is_banned ? "Unlock" : "Ban User"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* -------------------- PLAYLISTS -------------------- */}
        {activeTab==="playlists" && (
          <div className="admin-content">
            <h2 className="admin-section-title">Playlist Management</h2>

            <div className="admin-sort-controls">
              <div className="admin-sort-by">
                <span>Sort by:</span>
                {["date","name","songs"].map(f => (
                  <button key={f}
                    className={`admin-sort-btn ${sortBy===f?"active":""}`}
                    onClick={() => handleSortBy(f)}>
                    {f==="songs" ? "Songs" : f.charAt(0).toUpperCase()+f.slice(1)}
                  </button>
                ))}
              </div>
              <button className="admin-sort-order-btn" onClick={toggleSortOrder}>
                {sortOrder==="asc" ? "↑ Ascending" : "↓ Descending"}
              </button>
            </div>

            <div className="admin-playlist-grid">
              {playlists.map(pl => (
                <div key={pl.id} className="admin-playlist-card">
                  <div className="admin-playlist-header">
                    <h3 className="admin-playlist-name">{pl.name}</h3>
                    <span className="admin-playlist-songs">
                      {pl.songCount} songs
                    </span>
                  </div>

                  <div className="admin-playlist-info">
                    <div className="admin-playlist-owner">
                      Owner: {pl.owner}
                    </div>
                    <div className="admin-playlist-date">
                      Created: {new Date(pl.created).toLocaleDateString()}
                    </div>
                  </div>

                  <button className="admin-delete-playlist-btn"
                          onClick={()=>deletePlaylist(pl.id)}>
                    Delete Playlist
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* -------------------- LOGS (placeholder) -------------------- */}
        {activeTab==="logs" && (
          <div className="admin-content">
            <h2 className="admin-section-title">System Logs</h2>

            {logs.length === 0 ? (
              <p style={{color:"#999"}}>No logs yet…</p>
            ) : (
              <table className="admin-logs-table">
                <thead>
                  <tr>
                    <th style={{width:"140px"}}>Timestamp</th>
                    <th style={{width:"110px"}}>Action</th>
                    <th>Description</th>
                    <th style={{width:"150px"}}>Actor</th>
                  </tr>
                </thead>
                <tbody>
                  {logs.map(l=>(
                    <tr key={l.id}>
                      <td>{new Date(l.created_at).toLocaleString()}</td>
                      <td>{l.action}</td>
                      <td>
                        {renderDescription(l)}
                      </td>
                      <td>{l.actor ? l.actor.username : "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </>
      )}

      {/* -------------------- USER DETAILS MODAL -------------------- */}
      {showUserDetails && selectedUser && (
        <div className="admin-modal-overlay" onClick={closeUserDetails}>
          <div className="admin-modal-content" onClick={e=>e.stopPropagation()}>
            <button className="admin-modal-close" onClick={closeUserDetails}>×</button>

            <h2 className="admin-modal-title">{selectedUser.username}</h2>

            <div className="admin-modal-info">
              <div className="admin-modal-field">
                <span className="admin-modal-label">Email:</span>
                <span className="admin-modal-value">{selectedUser.email}</span>
              </div>
              <div className="admin-modal-field">
                <span className="admin-modal-label">Registration Date:</span>
                <span className="admin-modal-value">
                  {new Date(selectedUser.created).toLocaleDateString()}
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
              <button className="admin-modal-reset-btn"
                      onClick={()=>resetPassword(selectedUser.id)}>
                Reset Password
              </button>
              <button className="admin-modal-ban-btn"
                      disabled={false}
                      onClick={()=>{
                        banUser(selectedUser.id, selectedUser.is_banned);
                        closeUserDetails();
                      }}>
                {selectedUser.is_banned ? "Unlock" : "Ban User"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
