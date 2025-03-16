// This service handles API calls related to playlists

// Base API URL - replace with your actual API endpoint
const API_BASE_URL = "/api";

/**
 * Fetches the current user's playlist
 * @returns {Promise<Object>} The playlist data with tracks and user info
 */
export const fetchUserPlaylist = async () => {
  try {
    // For development/testing, you can use this mock data
    // if (
    //   process.env.NODE_ENV === "development" &&
    //   !process.env.REACT_APP_USE_API
    // ) {
    //   return getMockPlaylist();
    // }

    const response = await fetch(`${API_BASE_URL}/playlist`);

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching playlist:", error);
    // Return mock data as fallback in case of error
    //return getMockPlaylist();
  }
};

/**
 * Updates play count for a track
 * @param {string} trackId - The ID of the track
 * @returns {Promise<Object>} The updated track data
 */
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

/**
 * Toggles favorite status for a track
 * @param {string} trackId - The ID of the track
 * @param {boolean} isFavorite - Whether the track should be marked as favorite
 * @returns {Promise<Object>} The updated track data
 */
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

/**
 * Mock playlist data for development and testing
 * @returns {Object} Mock playlist data
 */
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
