// tests/setup.ts
import { AppDataSource } from "../src/database/config/data-source";
import { User } from "../src/models/User";
import { Playlist } from "../src/models/Playlist";
import { Song } from "../src/models/Song";
import { PlaylistSong } from "../src/models/PlaylistSong";

export let fixtures: {
  user: User;
  song: Song;
};

beforeAll(async () => {
  // 1. inicjalizacja
  await AppDataSource.initialize();
  await AppDataSource.synchronize(true);   // czyści schemat testowy

  // 2. seed
  const userRepo = AppDataSource.getRepository(User);
  const songRepo = AppDataSource.getRepository(Song);
  const plRepo   = AppDataSource.getRepository(Playlist);
  const psRepo   = AppDataSource.getRepository(PlaylistSong);

  const user = await userRepo.save(userRepo.create({
    username: "TestUser",
    email: "test@example.com",
    password_hash: "hash"
  }));

  const song = await songRepo.save(songRepo.create({
    title: "Test song",
    audio_url: "https://www.mfiles.co.uk/mp3-downloads/gs-cd-track2.mp3"
  }));

  const playlist = await plRepo.save(plRepo.create({
    name: "Test playlist",
    owner: user
  }));

  await psRepo.save(psRepo.create({
    playlist,
    song,
    order_index: 1
  }));

  fixtures = { user, song };          // ← udostępniamy testom
});

afterAll(async () => {
  await AppDataSource.destroy();
});
