import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function RequireRole({ role }) {
  const { user, loading } = useAuth();
  if (loading) return null;                
  return user && user.role===role ? <Outlet/> : <Navigate to="/" replace />;
}
