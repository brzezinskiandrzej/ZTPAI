import express from "express";
import { Request, Response } from "express";
import { AppDataSource } from "../../../database/config/data-source";
import { User } from "../models/User";
import { Playlist } from "../models/Playlist";
import { PlaylistSong } from "../models/PlaylistSong";
import { Song } from "../models/Song";
import { LikedSong } from "../models/LikedSong";
import { url } from "inspector";

const router = express.Router();



router.get("/playlist/:userId", async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    const userRepo = AppDataSource.getRepository(User);
    const user = await userRepo.findOneBy({ user_id: +userId });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const playlistRepo = AppDataSource.getRepository(Playlist);
    const playlist = await playlistRepo.findOne({
      where: { owner: { user_id: +userId } },
      relations: ["owner", "playlistSongs"],  
    });

    if (!playlist) {
      return res.status(404).json({ error: "Playlist not found for this user" });
    }

    const playlistSongRepo = AppDataSource.getRepository(PlaylistSong);
    const playlistSongs = await playlistSongRepo.find({
      where: { playlist_id: playlist.playlist_id },
      relations: ["song"],
      order: { order_index: "ASC" }
    });

    const tracks = playlistSongs.map(ps => {
      const s = ps.song;
      return {
        id: s.song_id,
        title: s.title,
        artwork: s.artwork_url,
        playCount: s.play_count,
        duration: "3:27", 
        isFavorite: false, 
        url: "https://www.mfiles.co.uk/mp3-downloads/..."  
      };
    });

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
      return res.json({
        success: true,
        message: `Track ${trackId} added to favorites`
      });
    } else {
      await likedSongRepo.delete({ user_id: userId, song_id: +trackId });
      return res.json({
        success: true,
        message: `Track ${trackId} removed from favorites`
      });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
});

export default router;
