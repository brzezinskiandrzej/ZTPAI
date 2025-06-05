// src/services/playlist.service.ts
import { AppDataSource } from "../database/config/data-source";
import { User } from "../models/User";
import { Playlist } from "../models/Playlist";
import { PlaylistSong } from "../models/PlaylistSong";
import AppError from "../middlewares/AppError";
import { Song } from "../models/Song";
import { LikedSong } from "../models/LikedSong";

export async function getUserPlaylist(userId: number,playlistId: number) {
  const userRepo = AppDataSource.getRepository(User);
  const user = await userRepo.findOneBy({ user_id: userId });
  if (!user) throw new AppError(
    404,
    "playlist/user-not-found",
    "Użytkownik nie istnieje",
    "userId"
  );

  const playlistRepo = AppDataSource.getRepository(Playlist);
  const playlist = await playlistRepo.findOne({
    where: { playlist_id: playlistId, owner: { user_id: userId } },
    relations: ["playlistSongs", "playlistSongs.song", "playlistSongs.song.artist"],
  });
  if (!playlist) throw new AppError(
    404,
    "playlist/not-found",
    "Playlista nie znaleziona",
    "playlistId"
  );
  const likedRepo = AppDataSource.getRepository(LikedSong);
  const likedRows = await likedRepo.find({
    where: { user_id: userId },
    select: { song_id: true },
  });
  const likedSet = new Set(likedRows.map(l => l.song_id));

  const tracks = playlist.playlistSongs
    .sort((a, b) => a.order_index - b.order_index)
    .map((ps) => ({
      id: ps.song.song_id,
      title: ps.song.title,
      artist: ps.song.artist?.name ?? "Unknown",
      artwork: ps.song.artwork_url,
      playCount: ps.song.play_count,
      duration: "",
      isFavorite: likedSet.has(ps.song.song_id),  
      url: ps.song.audio_url,
    }));

  return { username: user.username, playlistName: playlist.name, tracks };
}

export async function incrementPlay(trackId: number) {
    const songRepo = AppDataSource.getRepository(Song);
    const song = await songRepo.findOneBy({ song_id: trackId });
    if (!song) throw new AppError(
      404,
      "song/not-found",
      "Utwór nie istnieje",
      "trackId"
    );
  
    song.play_count += 1;
    await songRepo.save(song);
  
    return { playCount: song.play_count };   
  }
  export async function toggleFavorite(
    userId: number,
    trackId: number,
    isFavorite: boolean
  ) {
    const songRepo  = AppDataSource.getRepository(Song);
    const likeRepo  = AppDataSource.getRepository(LikedSong);
  
    const song = await songRepo.findOneBy({ song_id: trackId });
    if (!song) throw new AppError(
      404,
      "song/not-found",
      "Utwór nie istnieje",
      "trackId"
    );
  
    if (isFavorite) {
      const exists = await likeRepo.findOneBy({ user_id: userId, song_id: trackId });
      if (!exists) {
        await likeRepo.save(likeRepo.create({ user_id: userId, song_id: trackId }));
      }
      return { isFavorite: true };
    }
  
    await likeRepo.delete({ user_id: userId, song_id: trackId });
    return { isFavorite: false };
  }



export async function getSavedPlaylists(ownerId:number){
  const repo = AppDataSource.getRepository(Playlist);
  const rows = await repo
    .createQueryBuilder("p")
    .leftJoin("p.playlistSongs", "ps")
    .select([
      "p.playlist_id   AS id",
      "p.name          AS name",
      "p.created_at    AS createdAt",
      "COUNT(ps.song_id) AS tracks"
    ])
    .where("p.ownerUserId = :ownerId", { ownerId })
    .groupBy("p.playlist_id")
    .orderBy("p.created_at", "DESC")
    .getRawMany();
  return rows.map(toDto); 
}

// na końcu pliku – nowa funkcja
export async function getLikedSongs(userId: number) {
  const userRepo  = AppDataSource.getRepository(User);
  const likeRepo  = AppDataSource.getRepository(LikedSong);

  const user = await userRepo.findOneBy({ user_id: userId });
  if (!user)
    throw new AppError(404,"playlist/user-not-found","Użytkownik nie istnieje","userId");

  const rows = await likeRepo.find({
    where     : { user_id: userId },
    relations : ["song", "song.artist"],
    order     : { created_at: "DESC" },
  });

  const tracks = rows.map(l => ({
    id        : l.song.song_id,
    title     : l.song.title,
    artist    : l.song.artist?.name ?? "Unknown",
    artwork   : l.song.artwork_url,
    playCount : l.song.play_count,
    duration  : "",
    isFavorite: true,                 // ← wszystkie to ulubione
    url       : l.song.audio_url,
  }));

  return { username: user.username, playlistName: "Liked songs", tracks };
}


function toDto(value: any, index: number, array: any[]): unknown {
  throw new Error("Function not implemented.");
}

