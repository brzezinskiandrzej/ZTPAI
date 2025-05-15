import React, { createContext, useContext, useEffect, useState } from "react";
import * as api from "../services/authService";
const jwt_decode = require("jwt-decode");

const AuthCtx   = createContext(null);
export const useAuth = () => useContext(AuthCtx);

const LS_TOKEN  = "MM_ACCESS";
const LS_USER   = "MM_USER";        // <- przechowujemy również uproszczony user

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem(LS_TOKEN));
  const [user,  setUser ] = useState(() => {
    const u = localStorage.getItem(LS_USER);
    if (u) return JSON.parse(u);
    if (!token) return null;
    try {                           // lepiej spróbować z tokenu (bez czekania na backend)
      const { sub, role, username } = jwt_decode.default(token);
      return { id: sub, role, username };
    } catch { return null; }
  });
  const [loading, setLoading] = useState(!!token && !user);   // jeden render później

  /** helper zapisujący oba pola + localStorage */
  const setAuth = (u, t) => {
    if (t) {
      localStorage.setItem(LS_TOKEN, t);
      setToken(t);
    } else {
      localStorage.removeItem(LS_TOKEN);
      setToken(null);
    }
    if (u) {
      localStorage.setItem(LS_USER, JSON.stringify(u));
      setUser(u);
    } else {
      localStorage.removeItem(LS_USER);
      setUser(null);
    }
  };

  /* ⇨ Jednorazowa próba „ożywienia” sesji z refresh-cookie  */
  useEffect(() => {
    (async () => {
      if (!token) return;
      try {
        const data = await api.refresh();        // POST /refresh
        if (data?.accessToken) setAuth(data.user, data.accessToken);
      } finally { setLoading(false); }
    })();
  }, []);                                        // pierwszy render

  /* ⇨ auto-refresh co 4,5 minuty */
  useEffect(() => {
    if (!token) return;
    const id = setInterval(async () => {
      const data = await api.refresh();
      if (data?.accessToken) setAuth(data.user, data.accessToken);
    }, 270_000);
    return () => clearInterval(id);
  }, [token]);

  /* ---------- akcje ---------- */
  const signin = async (email, password) => {
    const data = await api.login({ email, password });
    setAuth(data.user, data.accessToken);
  };
  const signup = async (payload) => {
    await api.register(payload);
    await signin(payload.email, payload.password);
  };
  const signout = async () => {
    await api.logout();
    setAuth(null, null);
  };

  const value = { user, token, loading, signin, signup, signout };
  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>;
}
