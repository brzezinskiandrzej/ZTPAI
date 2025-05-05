import express from "express";
import { Request, Response } from "express";
import { AppDataSource } from "../database/config/data-source";
import { User } from "../models/User";
import { Playlist } from "../models/Playlist";
import { PlaylistSong } from "../models/PlaylistSong";
import { Song } from "../models/Song";
import { LikedSong } from "../models/LikedSong";
import { url } from "inspector";
import { isNumeric } from "../utils/isNumeric";

const router = express.Router();



router.get("/playlist/:userId", async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    if (!isNumeric(userId)) {
      return res.status(400).json({ error: "userId must be numeric" });
    }
    console.log("Fetching playlist for user:", userId);
    const userRepo = AppDataSource.getRepository(User);
    const user = await userRepo.findOneBy({ user_id: +userId });
    console.log("User fetched:", user);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const playlistRepo = AppDataSource.getRepository(Playlist);
    const playlist = await playlistRepo.findOne({
      where: { owner: { user_id: +userId } },
      relations: ["owner", "playlistSongs"],  
    });
    console.log("Playlist fetched:", playlist);
    if (!playlist) {
      return res.status(404).json({ error: "Playlist not found for this user" });
    }

    const playlistSongRepo = AppDataSource.getRepository(PlaylistSong);
    const playlistSongs = await playlistSongRepo.find({
      where: { playlist_id: playlist.playlist_id },
      relations: ["song", "song.artist"],
      order: { order_index: "ASC" }
    });
    console.log("Playlist songs fetched:", playlistSongs);
    const tracks = playlistSongs.map(ps => {
      const s = ps.song;
      return {
        id: s.song_id,
        title: s.title,
        artist: s.artist?.name || "Unknown",
        artwork: s.artwork_url,
        playCount: s.play_count,
        duration: "", 
        isFavorite: false, 
        url: s.audio_url, 
      };
    });
    console.log("Tracks prepared:", tracks);
    const likedSongRepo = AppDataSource.getRepository(LikedSong);
    const likedEntries = await likedSongRepo.find({
      where: { user_id: +userId }
    });
    const likedSet = new Set(likedEntries.map(ls => ls.song_id));

    tracks.forEach(t => {
      if (likedSet.has(t.id)) {
        t.isFavorite = true;
      }
    });

    return res.status(200).json({
      username: user.username,
      playlistName: playlist.name,
      tracks
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
});

router.post("/tracks/:trackId/play", async (req: Request, res: Response) => {
  try {
    const { trackId } = req.params;
    if (!isNumeric(trackId)) {
      return res.status(400).json({ error: "trackId must be numeric" });
    }
    const songRepo = AppDataSource.getRepository(Song);
    const song = await songRepo.findOneBy({ song_id: +trackId });
    if (!song) {
      return res.status(404).json({ error: "Track not found" });
    }

    song.play_count += 1;
    await songRepo.save(song);

    return res.json({
      success: true,
      message: `Play count updated for track ${trackId}`,
      playCount: song.play_count
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
});


router.post("/tracks/:trackId/favorite", async (req: Request, res: Response) => {
  try {
    const { trackId } = req.params;
    const { isFavorite } = req.body;
    const userId = +(req.query.userId || 1);
    if (!isNumeric(trackId)) {
      return res.status(400).json({ error: "trackId must be numeric" });
    }
    if (typeof isFavorite !== "boolean") {
      // 422 – niepoprawna wartość pola
      return res
        .status(422)
        .json({ error: "`isFavorite` must be boolean true/false" });
    }
    const songRepo = AppDataSource.getRepository(Song);
    const song = await songRepo.findOneBy({ song_id: +trackId });
    if (!song) {
      return res.status(404).json({ error: "Track not found" });
    }

    const likedSongRepo = AppDataSource.getRepository(LikedSong);
    if (isFavorite) {
      const exists = await likedSongRepo.findOneBy({ user_id: userId, song_id: +trackId });
      if (!exists) {
        const newLike = likedSongRepo.create({
          user_id: userId,
          song_id: +trackId
        });
        await likedSongRepo.save(newLike);
      }
      return res.status(201).json({ success: true });
    } else {
      await likedSongRepo.delete({ user_id: userId, song_id: +trackId });
      return res.status(200).json({ success: true });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
});

export default router;
