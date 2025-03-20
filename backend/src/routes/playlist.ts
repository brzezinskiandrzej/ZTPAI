import express from "express";
import { Request, Response } from "express";
import { url } from "inspector";

const router = express.Router();

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
            url: "https://www.mfiles.co.uk/mp3-downloads/gs-cd-track2.mp3",
          },
          {
            id: "2",
            title: "Yellow",
            artist: "Coldplay",
            artwork: "https://placehold.co/40x40/673ab7/673ab7",
            playCount: "460,228,511",
            duration: "3:27",
            isFavorite: false,
            url: "https://www.mfiles.co.uk/mp3-downloads/i-do-like-to-be-beside-the-seaside.mp3",
          },
          {
            id: "3",
            title: "The Scientist",
            artist: "Coldplay",
            artwork: "https://placehold.co/40x40/90a4ae/90a4ae",
            playCount: "460,228,511",
            duration: "3:27",
            isFavorite: false,
            url: "https://www.mfiles.co.uk/mp3-downloads/polly-perkins-of-paddington-green.mp3",
          },
          {
            id: "4",
            title: "Fix You",
            artist: "Coldplay",
            artwork: "https://placehold.co/40x40/f44336/f44336",
            playCount: "460,228,511",
            duration: "3:27",
            isFavorite: false,
            url: "https://www.mfiles.co.uk/mp3-downloads/the-man-who-broke-the-bank-at-monte-carlo.mp3",
          },
          {
            id: "5",
            title: "Viva La Vida",
            artist: "Coldplay",
            artwork: "https://placehold.co/40x40/eceff1/eceff1",
            playCount: "460,228,511",
            duration: "3:27",
            isFavorite: false,
            url: "https://www.mfiles.co.uk/mp3-downloads/its-a-long-long-way-to-tipperary.mp3",
          },
          {
            id: "6",
            title: "Perfect",
            artist: "Ed Sheeran",
            artwork: "https://placehold.co/40x40/9c27b0/9c27b0",
            playCount: "1,952,015,881",
            duration: "4:23",
            isFavorite: false,
            url: "https://www.mfiles.co.uk/mp3-downloads/lets-all-go-down-the-strand.mp3",
          },
        ],
      },
    ],
  },
];

router.get("/playlist/:userId", (req: Request, res: Response) => {
  const { userId } = req.params;

  const user = users.find((u) => u.id === userId);

  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  const playlist = user.playlists[0];

  res.status(200).json({
    username: user.username,
    playlistName: playlist.name,
    tracks: playlist.tracks,
  });
});

router.post("/tracks/:trackId/play", (req: Request, res: Response) => {
  const { trackId } = req.params;
  const userId = "1"; // In a real app, this would come from authentication

  const user = users.find((u) => u.id === userId);
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  const playlist = user.playlists[0];
  const track = playlist.tracks.find((t) => t.id === trackId);

  if (!track) {
    return res.status(404).json({ error: "Track not found" });
  }


  res.json({
    success: true,
    message: `Play count updated for track ${trackId}`,
  });
});

router.post("/tracks/:trackId/favorite", (req: Request, res: Response) => {
  const { trackId } = req.params;
  const { isFavorite } = req.body;
  const userId = "1"; 

  const user = users.find((u) => u.id === userId);
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  const playlist = user.playlists[0];
  const trackIndex = playlist.tracks.findIndex((t) => t.id === trackId);

  if (trackIndex === -1) {
    return res.status(404).json({ error: "Track not found" });
  }

  playlist.tracks[trackIndex].isFavorite = isFavorite;

  res.json({
    success: true,
    message: `Track ${trackId} ${isFavorite ? "added to" : "removed from"} favorites`,
    track: playlist.tracks[trackIndex],
  });
});

export default router;
