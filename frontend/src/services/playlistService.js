// This service handles API calls related to playlists

// Base API URL - replace with your actual API endpoint
const API_BASE_URL = "/api";


export const fetchUserPlaylist = async (userId) => {
  try {
    // For development/testing, you can use this mock data
    // if (
    //   process.env.NODE_ENV === "development" &&
    //   !process.env.REACT_APP_USE_API
    // ) {
    //   return getMockPlaylist();
    // }

    const response = await fetch(`${API_BASE_URL}/playlist/${userId}`);

    if (!response.ok) {
      let errorMessage = "";

      switch (response.status) {
        case 400:
          errorMessage = "400 Bad Request – Niepoprawne zapytanie klienta.";
          break;
        case 401:
          errorMessage = "401 Unauthorized – Musisz się zalogować.";
          break;
        case 403:
          errorMessage = "403 Forbidden – Brak dostępu do zasobu.";
          break;
        case 404:
          errorMessage = "404 Not Found – Użytkownik o podanym ID nie istnieje.";
          break;
        case 500:
          errorMessage = "500 Internal Server Error – Błąd po stronie serwera.";
          break;
        case 503:
          errorMessage = "503 Service Unavailable – Serwer jest chwilowo niedostępny.";
          break;
        default:
          errorMessage = `Nieoczekiwany błąd: Kod ${response.status}`;
    }
    throw new Error(errorMessage);}

    return await response.json();
  } catch (error) {
    console.error("Error fetching playlist:", error);
    // Return mock data as fallback in case of error
    //return getMockPlaylist();
    throw error;
  }
};

export const updatePlayCount = async (trackId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/tracks/${trackId}/play`, {
      method: "POST",
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error updating play count:", error);
    throw error;
  }
};


export const toggleFavorite = async (trackId, isFavorite) => {
  try {
    const response = await fetch(`${API_BASE_URL}/tracks/${trackId}/favorite`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ isFavorite }),
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error toggling favorite:", error);
    throw error;
  }
};


// const getMockPlaylist = () => {
//   return {
//     username: "Andrew",
//     playlistName: "Your Today's Moody Playlist",
//     tracks: [
//       {
//         id: "1",
//         title: "Shiver",
//         artist: "Coldplay",
//         artwork: "https://placehold.co/40x40/607d8b/607d8b",
//         playCount: "460,228,511",
//         duration: "3:27",
//         isFavorite: false,
//       },
//       {
//         id: "2",
//         title: "Yellow",
//         artist: "Coldplay",
//         artwork: "https://placehold.co/40x40/673ab7/673ab7",
//         playCount: "460,228,511",
//         duration: "3:27",
//         isFavorite: false,
//       },
//       {
//         id: "3",
//         title: "The Scientist",
//         artist: "Coldplay",
//         artwork: "https://placehold.co/40x40/90a4ae/90a4ae",
//         playCount: "460,228,511",
//         duration: "3:27",
//         isFavorite: false,
//       },
//       {
//         id: "4",
//         title: "Fix You",
//         artist: "Coldplay",
//         artwork: "https://placehold.co/40x40/f44336/f44336",
//         playCount: "460,228,511",
//         duration: "3:27",
//         isFavorite: false,
//       },
//       {
//         id: "5",
//         title: "Viva La Vida",
//         artist: "Coldplay",
//         artwork: "https://placehold.co/40x40/eceff1/eceff1",
//         playCount: "460,228,511",
//         duration: "3:27",
//         isFavorite: false,
//       },
//       {
//         id: "6",
//         title: "Perfect",
//         artist: "Ed Sheeran",
//         artwork: "https://placehold.co/40x40/9c27b0/9c27b0",
//         playCount: "1,952,015,881",
//         duration: "4:23",
//         isFavorite: false,
//       },
//     ],
//   };
// };
