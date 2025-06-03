import jwt from "jsonwebtoken";
jest.mock("swagger-jsdoc", () => {
  return () => ({ });                 
});
import { AppDataSource } from "../src/database/config/data-source";
import { User } from "../src/models/User";
import { Song } from "../src/models/Song";
import { Playlist } from "../src/models/Playlist";
import { PlaylistSong } from "../src/models/PlaylistSong";

export interface Fixtures {
  user     : User;
  token    : string;
  song     : Song;
  playlist : Playlist;
}

export let fx: Fixtures;                          // ⬅ export z aliasem „fx”

beforeAll(async () => {
  await AppDataSource.initialize();
  await AppDataSource.synchronize(true);

  const user = await AppDataSource.getRepository(User).save(
    AppDataSource.getRepository(User).create({
      username: "Tester",
      email: "t@example.com",
      password_hash: "hash"
    })
  );

  const song = await AppDataSource.getRepository(Song).save(
    AppDataSource.getRepository(Song).create({
      title: "Seed track",
      audio_url: "http://example.com/seed.mp3",
      valence: .5, energy: .5, tempo: 120, musical_key: "C", genres: "pop"
    })
  );

  const playlist = await AppDataSource.getRepository(Playlist).save(
    AppDataSource.getRepository(Playlist).create({ name: "Seed", owner: user })
  );

  await AppDataSource.getRepository(PlaylistSong).save(
    { playlist, song, order_index: 1 }
  );

  const token = jwt.sign(
    { sub: user.user_id, role: "user", username: user.username },
    process.env.ACCESS_TOKEN_SECRET!,
    { expiresIn: "1h" }
  );

  fx = { user, token, song, playlist };
});

afterAll(() => AppDataSource.destroy());
