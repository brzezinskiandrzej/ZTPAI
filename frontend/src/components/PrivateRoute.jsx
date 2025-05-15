import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

/**
 *  Chroni zagnieżdżone trasy.
 *  Jeśli w kontekście jest `user` ➜ wpuszcza.
 *  W przeciwnym razie ➜ redirect na /login.
 */
export default function PrivateRoute() {
  const { user } = useAuth();
  return user ? <Outlet /> : <Navigate to="/login" replace />;
}
