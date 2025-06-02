import { useFetchWithAuth } from "./fetchWithAuth";
const API_BASE_URL = "/api";

export function usePlaylistApi() {
  const fetcher = useFetchWithAuth();
  const fetchUserPlaylist = async (userId, playlistId) => {
    return fetcher(`${API_BASE_URL}/playlist/${userId}/${playlistId}`, { method: "GET" });
  };
  const updatePlayCount = async (trackId) => {
    await fetcher(`${API_BASE_URL}/tracks/${trackId}/play`, { method: "POST" });
  };
  const toggleFavorite = async (trackId, isFavorite) => {
    await fetcher(`${API_BASE_URL}/tracks/${trackId}/favorite`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isFavorite })
    });
    
  };
  return { fetchUserPlaylist, updatePlayCount, toggleFavorite };
};
  


  



