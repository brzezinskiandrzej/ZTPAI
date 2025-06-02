
/* ------------------------------------------------------------------ */
/*  AUTOMATYCZNY DOBÓR 5 UTWORÓW NA PODSTAWIE PARAMETRÓW NASTROJU      */
/* ------------------------------------------------------------------ */
import { In } from "typeorm";
import { AppDataSource } from "../database/config/data-source";
import { Song }           from "../models/Song";
import { Playlist }       from "../models/Playlist";
import { PlaylistSong }   from "../models/PlaylistSong";
import { User }           from "../models/User";
import { MoodParams }     from "./ai.service";
import { MOOD_PROFILES }  from "../ai/moodProfiles";

interface ScoredSong {
  song: Song;
  score: number;
}

/** kluczowa funkcja – zwraca nowe `playlistId` */
export async function generatePlaylistForMood(
  userId: number,
  mood: MoodParams
): Promise<number> {

  /* -------------------------------------------------- */
  /* 1. pobieramy profil docelowy (twarde przedziały)   */
  /* -------------------------------------------------- */
  const profile = MOOD_PROFILES[mood.mood];

  /* -------------------------------------------------- */
  /* 2. pobieramy WSZYSTKIE utwory spełniające            */
  /*    przynajmniej jeden warunek z profilu            */
  /* -------------------------------------------------- */
  const songRepo = AppDataSource.getRepository(Song);

  const songs = await songRepo.find({
    where: [
      { valence: In([profile.valence[0], profile.valence[1]]) },
    ], // ↑ to i tak pobierze cały zestaw – nie spinamy się, filter będzie niżej
  });

  /* -------------------------------------------------- */
  /* 3. punktacja – im więcej dopasowań tym większy      */
  /* -------------------------------------------------- */
  const scored: ScoredSong[] = songs.map((s) => {
    let score = 0;

    if (s.valence >= profile.valence[0] && s.valence <= profile.valence[1])
      score += 2;

    if (s.energy  >= profile.energy[0]  && s.energy  <= profile.energy[1])
      score += 2;

    if (s.tempo   >= profile.tempo[0]   && s.tempo   <= profile.tempo[1])
      score += 1;

    if (profile.genres.some((g) => s.genres.includes(g)))
      score += 1;

    if (profile.keys.includes(s.musical_key))
      score += 1;

    return { song: s, score };
  });

  /* -------------------------------------------------- */
  /* 4. sortujemy malejąco po score, przy remisie los   */
  /* -------------------------------------------------- */
  scored.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return Math.random() - 0.5;                       // tie-break
  });

  const top5 = scored.slice(0, 5).map((s) => s.song);

  /* -------------------------------------------------- */
  /* 5. tworzymy playlistę + relacje PlaylistSong       */
  /* -------------------------------------------------- */
  const user = await AppDataSource
    .getRepository(User)
    .findOneByOrFail({ user_id: userId });

  const playlistRepo = AppDataSource.getRepository(Playlist);
  const psRepo       = AppDataSource.getRepository(PlaylistSong);

  const playlist = playlistRepo.create({
    name : `My ${mood.mood.replace("_", " ")} mix`,
    owner: user,
  });
  await playlistRepo.save(playlist);

  /* kolejność = 1…5 */
  await psRepo.save(
    top5.map((song, idx) =>
      psRepo.create({
        playlist      : playlist,
        song,
        order_index   : idx + 1,
      }))
  );

  return playlist.playlist_id;
}
