// src/services/fetchWithAuth.js
import { useAuth } from "../context/AuthContext";

export function useFetchWithAuth() {
  const { token } = useAuth();

  return (url, options = {}) =>
    fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      credentials: "include",
    });
}
