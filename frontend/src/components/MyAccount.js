import React, { useEffect, useState } from "react";
import "./MyAccount.css";
import { useNavigate  } from "react-router-dom";
import { useAuth }       from "../context/AuthContext";
import { useAccountApi } from "../services/accountService";

function MyAccount() {
  const { user, signout } = useAuth();
  const api       = useAccountApi();
  const navigate  = useNavigate();

  const [profile,  setProfile ] = useState({ username:"", email:"" });
  const [form,     setForm    ] = useState({ username:"", email:"", oldPwd:"", newPwd:"" });
  const [editing,  setEditing ] = useState({ username:false, email:false, password:false });
  const [showPwd,  setShowPwd ] = useState(false);
  const [showSaved , setShowSaved ] = useState(false); 
  const [savedFetched, setSavedFetched] = useState(false);
  const [likes,    setLikes   ] = useState([]);  
  const [saved,    setSaved   ] = useState([]);   
  const [savedErr, setSavedErr] = useState(null);
  const [isSettingsOpen,setIsSettingsOpen] = useState(false);

  /* ---------- init ---------- */
  useEffect(()=>{ (async ()=>{
      const p = await api.getProfile();          // GET /api/account
      setProfile(p);
      setForm(f=>({ ...f, username:p.username, email:p.email }));
      setLikes(await api.getLikes());            // GET /api/account/likes
      setSaved(await api.getSaved());            // GET /api/account/playlists
      setSaved(await api.getSavedPlaylists());
  })(); },[]);

  /* ---------- helpers ---------- */
  const startEdit  = fld => setEditing(e=>({ ...e, [fld]:true  }));
  const cancelEdit = fld => setEditing(e=>({ ...e, [fld]:false }));
  const onChange   = e   => setForm({ ...form, [e.target.name]:e.target.value });

  const saveField  = async fld =>{
    await api.update({ [fld]: form[fld] });      // PATCH /api/account
    setProfile(p=>({ ...p, [fld]:form[fld] }));
    cancelEdit(fld);
  };
  const savePass   = async ()=>{
    await api.changePass({ oldPassword:form.oldPwd, newPassword:form.newPwd });
    setForm(f=>({ ...f, oldPwd:"", newPwd:"" }));
    cancelEdit("password");
  };
  const logout     = async ()=>{ await signout(); navigate("/"); };
  const togglePwd  = ()=> setShowPwd(s=>!s);
  const toggleSettings = ()=> setIsSettingsOpen(o=>!o);
  const toggleSaved = async () => {
    if (!showSaved && !savedFetched) {
      try {
      const list = await api.getSavedPlaylists();
      setSaved(list);
      setSavedFetched(true);
      }catch (e) {
        setSavedErr(e.data?.error?.message || "Nie udało się pobrać playlist");
      }
    }
      

    setShowSaved(!showSaved);
  };

  /* ---------- komponent pomocniczy – jeden wiersz ---------- */
  const Row = ({ id,label, children, onSave })=>(
    <div className="field-row">
      <div className="field-container">
        <label className="field-label">{label}</label>
        {children}
      </div>
      <button
        className="edit-button"
        onClick={ editing[id] ? onSave : ()=>startEdit(id) }
      >
        {editing[id] ? "Confirm changes" : "Modify"}
      </button>
    </div>
  );

  return (
   <div className="account-page">
      {/* ───── NAV ───── */}
      <nav className="account-nav">
        <div className="account-nav-container">
          <div className="logo" onClick={()=>navigate("/")} style={{cursor:"pointer"}}>
            <img src="/logo_mood_music.png" alt="Mood Music Logo" style={{height:"40px",objectFit:"contain"}} />
          </div>
          <button className="logout-button" onClick={logout}>Log Out</button>
        </div>
      </nav>

      {/* ───── TREŚĆ ───── */}
      <div className="account-content">
        <div className="account-card">

          {/* --------- avatar + powitanie --------- */}
          <div className="profile-header">
            <img src="https://placehold.co/120x120" className="profile-avatar" alt="Avatar"/>
            <h2 className="profile-greeting">Hi,&nbsp;{profile.username}</h2>
          </div>

          {/* --------- dane użytkownika --------- */}
          <div className="user-fields-container">
            <button onClick={toggleSettings} className="settings-button">⚙️</button>

            {/* USERNAME */}
            <Row id="username" label="Name" onSave={()=>saveField("username")}>
              <input
                name="username"
                type="text"
                value={form.username}
                readOnly={!editing.username}
                onChange={onChange}
                autoFocus={editing.username} 
                className="field-input"
              />
            </Row>

            {/* E-MAIL */}
            <Row id="email" label="Email" onSave={()=>saveField("email")}>
              <input
                name="email"
                type="email"
                value={form.email}
                readOnly={!editing.email}
                onChange={onChange}
                autoFocus={editing.email}
                className="field-input"
              />
            </Row>

            {/* PASSWORD */}
            <Row id="password" label="Password" onSave={savePass}>
              {editing.password ? (
                <>
                  <input
                    name="oldPwd"
                    type={showPwd?"text":"password"}
                    placeholder="Current password"
                    value={form.oldPwd}
                    onChange={onChange}
                    autoFocus={editing.oldPwd}
                    className="field-input"
                    style={{marginBottom:"6px"}}
                  />
                  <div style={{position:"relative"}}>
                    <input
                      name="newPwd"
                      type={showPwd?"text":"password"}
                      placeholder="New password"
                      value={form.newPwd}
                      onChange={onChange}
                      autoFocus={editing.newPwd}
                      className="field-input"
                    />
                    <span
                      className="eye"
                      style={{position:"absolute",right:"10px",top:"10px"}}
                      onClick={togglePwd}
                    >{showPwd ? "🙈" : "👁️"}</span>
                  </div>
                </>
              ) : (
                <input
                  type="password"
                  readOnly
                  value="********"
                  className="field-input"
                />
              )}
            </Row>
          </div>

          {/* --------- akcje (na razie linki „martwe”) --------- */}
          <div className="account-actions">
            <a href="#likes"  className="action-link" onClick={e=>{e.preventDefault(); navigate(`/playlist/liked`);}}>Liked</a>
            <button className="action-link" onClick={toggleSaved}>
              Saved Playlists
            </button>
            

          </div>
          {showSaved && saved.length === 0 && (
              <p id="savedInfo"style={{color:"#e5a853",textAlign:"center"}}>Brak zapisanych playlist</p>
            )}
            {savedErr && (
              <div className="error-box">
                {savedErr}
              </div>
            )}
          {showSaved && saved.length > 0 && (
            <table className="saved-table">
              <thead><tr><th>Name</th><th>Tracks</th><th>Open</th></tr></thead>
              <tbody>
                {saved.map(pl=>(
                  <tr key={pl.id}>
                    <td>{pl.name}</td>
                    <td>{pl.tracks}</td>
                    <td>
                      <button onClick={()=>navigate(`/playlist/${user.id}/${pl.id}`)}>
                        ▶
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}       
          {/* --------- SETTINGS MODAL (bez zmian) --------- */}
          {isSettingsOpen && (
            <div className="settings-modal-overlay">
              <div className="settings-modal">
                <div className="settings-header">
                  <h3 className="settings-title">Advanced Settings</h3>
                  <button onClick={toggleSettings} className="close-button">✕</button>
                </div>
                <div className="eq-placeholder">EQ Placeholder</div>
                <div className="settings-options">
                  <label className="settings-option">
                    <input type="checkbox"/><span className="option-text">Notifications</span>
                  </label>
                  <label className="settings-option">
                    <input type="checkbox"/><span className="option-text">Newsletter</span>
                  </label>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <footer className="account-footer">
        <div className="footer-links">
          <a href="#" className="footer-link">
            Terms & Conditions
          </a>
          <a href="#" className="footer-link">
            Support
          </a>
          <a href="#" className="footer-link">
            Log In
          </a>
        </div>
        <div className="footer-divider" />
        <div className="social-icons">
          <a href="#" className="social-icon">
            <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
            </svg>
          </a>
          <a href="#" className="social-icon">
            <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
              <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.88 2.89 2.89 0 0 1-2.88-2.88 2.89 2.89 0 0 1 2.88-2.88c.28 0 .54.05.79.13v-3.31a6.07 6.07 0 0 0-.79-.05A6.24 6.24 0 0 0 3 16a6.24 6.24 0 0 0 6.24 6.24 6.24 6.24 0 0 0 6.24-6.24V7.4a8.33 8.33 0 0 0 4.11 1.06V5.04c-.47 0-2.02-.05-3.09-.71z" />
            </svg>
          </a>
          <a href="#" className="social-icon">
            <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
            </svg>
          </a>
          <a href="#" className="social-icon">
            <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
            </svg>
          </a>
        </div>
      </footer>
    </div>
  );
}

export default MyAccount;
