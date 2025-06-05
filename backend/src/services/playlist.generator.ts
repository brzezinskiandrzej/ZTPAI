
import { AppDataSource } from "../database/config/data-source";
import { Song }           from "../models/Song";
import { Playlist }       from "../models/Playlist";
import { PlaylistSong }   from "../models/PlaylistSong";
import { User }           from "../models/User";
import { MoodParams }     from "./ai.service";
import { MOOD_PROFILES }  from "../ai/moodProfiles";

interface ScoredSong { song: Song; score: number; }

export async function generatePlaylistForMood(
  userId: number,
  mood: MoodParams
): Promise<number> {

  const p = MOOD_PROFILES[mood.mood];

  const songs = await AppDataSource.getRepository(Song).find();

  const scored: ScoredSong[] = songs.map((s) => {
    let score = 0;


    if (s.valence >= p.valence[0] && s.valence <= p.valence[1]) score += 2;
    if (s.energy  >= p.energy [0] && s.energy  <= p.energy [1]) score += 2;


    if (s.tempo   >= p.tempo  [0] && s.tempo   <= p.tempo  [1]) score += 1;

    if (p.genres.some((g) => s.genres?.toLowerCase().includes(g))) score += 1;

    if (p.keys.includes(s.musical_key)) score += 1;

    return { song: s, score };
  });

  scored.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return Math.random() - 0.5;
  });


  let top = scored.filter(s => s.score > 0).slice(0, 5).map(s => s.song);

  if (top.length < 5) {
    const remainder = songs.filter(s => !top.includes(s));
    while (top.length < 5 && remainder.length) {
      const idx = Math.floor(Math.random() * remainder.length);
      top.push(remainder.splice(idx, 1)[0]);
    }
  }

  const user = await AppDataSource
    .getRepository(User)
    .findOneByOrFail({ user_id: userId });

  const playlistRepo = AppDataSource.getRepository(Playlist);
  const psRepo       = AppDataSource.getRepository(PlaylistSong);

  const playlist = await playlistRepo.save(
    playlistRepo.create({
      name : `My ${mood.mood.replace("_", " ")} mix`,
      owner: user,
    })
  );

  await psRepo.save(
    top.map((song, i) =>
      psRepo.create({
        playlist,
        song,
        order_index: i + 1,
      }))
  );

  return playlist.playlist_id;
}
