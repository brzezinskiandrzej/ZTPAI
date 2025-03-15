import express from "express";
import { Request, Response } from "express";

const router = express.Router();

// Mock user data - in a real app, this would come from a database
const users = [
  {
    id: "1",
    username: "Andrew",
    playlists: [
      {
        id: "today-moody",
        name: "Your Today's Moody Playlist",
        tracks: [
          {
            id: "1",
            title: "Shiver",
            artist: "Coldplay",
            artwork: "https://placehold.co/40x40/607d8b/607d8b",
            playCount: "460,228,511",
            duration: "3:27",
            isFavorite: false,
          },
          {
            id: "2",
            title: "Yellow",
            artist: "Coldplay",
            artwork: "https://placehold.co/40x40/673ab7/673ab7",
            playCount: "460,228,511",
            duration: "3:27",
            isFavorite: false,
          },
          {
            id: "3",
            title: "The Scientist",
            artist: "Coldplay",
            artwork: "https://placehold.co/40x40/90a4ae/90a4ae",
            playCount: "460,228,511",
            duration: "3:27",
            isFavorite: false,
          },
          {
            id: "4",
            title: "Fix You",
            artist: "Coldplay",
            artwork: "https://placehold.co/40x40/f44336/f44336",
            playCount: "460,228,511",
            duration: "3:27",
            isFavorite: false,
          },
          {
            id: "5",
            title: "Viva La Vida",
            artist: "Coldplay",
            artwork: "https://placehold.co/40x40/eceff1/eceff1",
            playCount: "460,228,511",
            duration: "3:27",
            isFavorite: false,
          },
          {
            id: "6",
            title: "Perfect",
            artist: "Ed Sheeran",
            artwork: "https://placehold.co/40x40/9c27b0/9c27b0",
            playCount: "1,952,015,881",
            duration: "4:23",
            isFavorite: false,
          },
        ],
      },
    ],
  },
];

// Get current user's playlist
router.get("/playlist", (req: Request, res: Response) => {
  // In a real app, you would get the user ID from the session/token
  const userId = "1"; // Mock user ID

  const user = users.find((u) => u.id === userId);

  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  // Get the first playlist (today's moody playlist)
  const playlist = user.playlists[0];

  res.json({
    username: user.username,
    playlistName: playlist.name,
    tracks: playlist.tracks,
  });
});

// Update track play count
router.post("/tracks/:trackId/play", (req: Request, res: Response) => {
  const { trackId } = req.params;

  // In a real app, you would update the play count in the database
  // Here we just return a success message

  res.json({
    success: true,
    message: `Play count updated for track ${trackId}`,
  });
});

// Toggle track favorite status
router.post("/tracks/:trackId/favorite", (req: Request, res: Response) => {
  const { trackId } = req.params;
  const { isFavorite } = req.body;

  // In a real app, you would update the favorite status in the database
  // Here we just return a success message

  res.json({
    success: true,
    message: `Track ${trackId} ${isFavorite ? "added to" : "removed from"} favorites`,
  });
});

export default router;
