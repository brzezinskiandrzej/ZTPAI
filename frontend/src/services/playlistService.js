
const API_BASE_URL = "/api";


export const fetchUserPlaylist = async (userId) => {
  try {
    // For development/testing
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
    //return getMockPlaylist();
    throw error;
  }
};

export const updatePlayCount = async (trackId,userId=1) => {
  try {
    const response = await fetch(`${API_BASE_URL}/tracks/${trackId}/play?userId=${userId}`, {
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


export const toggleFavorite = async (trackId, isFavorite, userId=1) => {
  try {
    const response = await fetch(`${API_BASE_URL}/tracks/${trackId}/favorite?userId=${userId}`, {
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



