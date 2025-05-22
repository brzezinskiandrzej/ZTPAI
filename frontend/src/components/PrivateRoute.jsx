import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function PrivateRoute() {
  const { user,loading } = useAuth();
  const loc = useLocation();
  if (loading) return <div className="loading-spinner"></div>;
  if (!user) {
    sessionStorage.setItem("MM_BACK", loc.pathname);
    return <Navigate to="/login" replace />;
  }
  return <Outlet />;
}
