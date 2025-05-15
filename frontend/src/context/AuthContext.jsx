import React, { createContext, useContext, useState, useEffect } from "react";
import * as api from "../services/authService";

const AuthCtx = createContext(null);
export const useAuth = () => useContext(AuthCtx);

export function AuthProvider({ children }) {
  const [user,  setUser]  = useState(null);
  const [token, setToken] = useState(null);

  const signin = async (email, password) => {
    const data = await api.login({ email, password });
    setUser (data.user);
    setToken(data.accessToken);
  };

  const signup = async (payload) => { await api.register(payload); };

  const signout = async () => {
    await api.logout();
    setUser(null);
    setToken(null);
  };

  // auto‑refresh co 4,5 minuty (gdy access = 15 min)
  useEffect(() => {
    let id = setInterval(async () => {
      const data = await api.refresh();
      if (data) setToken(data.accessToken);
    }, 270_000);
    return () => clearInterval(id);
  }, []);

  return (
    <AuthCtx.Provider value={{ user, token, signin, signup, signout }}>
      {children}
    </AuthCtx.Provider>
  );
}
