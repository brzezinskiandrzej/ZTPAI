import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

/**
 *  Chroni zagnieżdżone trasy.
 *  Jeśli w kontekście jest `user` ➜ wpuszcza.
 *  W przeciwnym razie ➜ redirect na /login.
 */
export default function PrivateRoute() {
  const { user,loading } = useAuth();
  const loc = useLocation();
  if (loading) return <p style={{textAlign:"center",marginTop:"2rem"}}>⌛ sprawdzam sesję…</p>;
  if (!user) {
    // zapamiętaj ścieżkę, żeby po logowaniu wrócić
    sessionStorage.setItem("MM_BACK", loc.pathname);
    return <Navigate to="/login" replace />;
  }
  return <Outlet />;
}
