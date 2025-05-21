import { useFetchWithAuth } from "./fetchWithAuth";
const API = "/api/admin";

export function useAdminApi() {
  const fetcher = useFetchWithAuth();

  return {
    /* USERS */
    getUsers:        ()              => fetcher(`${API}/users`),
    banUser:         (id,ban=true)        =>
      fetcher(`${API}/users/${id}/ban`, {
        method :"PATCH",
        headers: {"Content-Type":"application/json"},
        body   : JSON.stringify({ban})
      }),
    resetPassword:   (id,newPass)         =>
      fetcher(`${API}/users/${id}/password`, {
        method :"PATCH",
        headers: {"Content-Type":"application/json"},
        body   : JSON.stringify({newPassword:newPass})
      }),
    /* PLAYLISTS */
    getPlaylists:    (sort = "date", dir = "desc") =>
      fetcher(`${API}/playlists?sort=${sort}&dir=${dir}`),
    deletePlaylist:  id              => fetcher(`${API}/playlists/${id}`,     {method:"DELETE"})
  };
}
