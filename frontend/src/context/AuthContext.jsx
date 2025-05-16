import React, { createContext, useContext, useEffect, useState } from "react";
import * as api from "../services/authService";
const jwt_decode = require("jwt-decode");

const AuthCtx   = createContext(null);
export const useAuth = () => useContext(AuthCtx);

const LS_TOKEN  = "MM_ACCESS";
const LS_USER   = "MM_USER";        // <- przechowujemy również uproszczony user

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem(LS_TOKEN));
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem(LS_USER);
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        if (parsed?.id && parsed?.username && parsed?.role) return parsed;
      } catch {
        localStorage.removeItem(LS_USER);
      }
    }

    if (token) {
      try {
        const decoded = jwt_decode(token);
        if (decoded.sub && decoded.username && decoded.role) {
          return {
            id: Number(decoded.sub),
            username: decoded.username,
            role: decoded.role
          };
        }
      } catch (error) {
        console.error("Błąd dekodowania tokenu:", error);
      }
    }
    
    localStorage.removeItem(LS_TOKEN);
    return null;
  });
  const [loading, setLoading] = useState(!!token && !user);   // jeden render później

  /** helper zapisujący oba pola + localStorage */
  const setAuth = (u, t) => {
    // Walidacja pełnej struktury
    if (u && (!u.id || !u.username || !u.role)) {
      console.error("Nieprawidłowa struktura użytkownika:", u);
      localStorage.removeItem(LS_USER);
      localStorage.removeItem(LS_TOKEN);
      setUser(null);
      setToken(null);
      return;
    }

    if (t) localStorage.setItem(LS_TOKEN, t);
    else localStorage.removeItem(LS_TOKEN);
    
    if (u) localStorage.setItem(LS_USER, JSON.stringify(u));
    else localStorage.removeItem(LS_USER);
    
    setUser(u);
    setToken(t);
  };
  /* ⇨ Jednorazowa próba „ożywienia” sesji z refresh-cookie  */
  useEffect(() => {
    (async () => {
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const data = await api.refresh();        // POST /refresh
        if (data?.accessToken) setAuth(data.user, data.accessToken);
      } catch (error) {
        console.error("Refresh error:", error);
      } finally {
        setLoading(false);
      }
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
  useEffect(() => {
    // Usuń niekompletne dane przy pierwszym ładowaniu
    const storedUser = localStorage.getItem(LS_USER);
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        if (!parsed.username || !parsed.role) {
          localStorage.removeItem(LS_USER);
          localStorage.removeItem(LS_TOKEN);
        }
      } catch {
        localStorage.removeItem(LS_USER);
        localStorage.removeItem(LS_TOKEN);
      }
    }
  }, []);

  /* ---------- akcje ---------- */
  const signin = async (email, password) => {
    
      const data = await api.login({ email, password });
      setAuth(data.user, data.accessToken);
      return data;
    
  };
  const signup = async (payload) => {
    
      await api.register(payload);
      return await signin(payload.email, payload.password);
   
  };
  const signout = async () => {
    await api.logout();
    setAuth(null, null);
  };

  const value = { user, token, loading, signin, signup, signout };
  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>;
}
