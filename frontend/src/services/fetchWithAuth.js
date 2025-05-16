import { useAuth } from "../context/AuthContext";

export function useFetchWithAuth() {
  const { token } = useAuth();

  return async (url, options = {}) => {
    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
          ...options.headers
        },
        credentials: "include"
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw {
          status: response.status,
          data,
          isApiError: true
        };
      }
      
      return data;
    } catch (error) {
      if (!error.isApiError) {
        throw {
          status: 500,
          data: { error: { code: "network-error" } }
        };
      }
      throw error;
    }
  };
}