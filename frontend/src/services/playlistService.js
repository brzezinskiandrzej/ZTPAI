import { useFetchWithAuth } from "./fetchWithAuth";
const API_BASE_URL = "/api";

export function usePlaylistApi() {
  const fetcher = useFetchWithAuth();
  const fetchUserPlaylist = async (userId) => {
      const response = await fetcher(`${API_BASE_URL}/playlist/${userId}`, {
       method: "GET",
     });
  };
  const updatePlayCount =(trackId,userId=1) => {
    
      fetcher(`${API_BASE_URL}/tracks/${trackId}/play?userId=${userId}`, {
        method: "POST",
      });

      

    
  };
  const toggleFavorite = (trackId, isFavorite, userId=1) => {
    
      fetcher(`${API_BASE_URL}/tracks/${trackId}/favorite?userId=${userId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ isFavorite }),
      });

      

     
  };
  return { fetchUserPlaylist, updatePlayCount, toggleFavorite };
};
  


  



