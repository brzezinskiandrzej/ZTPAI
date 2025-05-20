import { useFetchWithAuth } from "./fetchWithAuth";
const API = "/api/account";

export function useAccountApi() {
  const fetcher = useFetchWithAuth();
  const getSavedPlaylists = () =>
    fetcher("/api/playlist/mine"); 
  return {
    getProfile : ()            => fetcher(API),
    getSavedPlaylists,
    update     : (payload)     => fetcher(API,{ method:"PATCH", body:JSON.stringify(payload) }),
    changePass : (p)           => fetcher(`${API}/password`,{ method:"PATCH", body:JSON.stringify(p) }),
    getLikes   : ()            => fetcher(`${API}/likes`),
    getSaved   : ()            => fetcher(`${API}/playlists`)
  };
}
