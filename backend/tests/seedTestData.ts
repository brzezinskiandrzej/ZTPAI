import { AppDataSource } from '../src/database/config/data-source';
import { User } from "../src/models/User";
import { Song } from "../src/models/Song";
import { Playlist } from "../src/models/Playlist";
import { PlaylistSong } from "../src/models/PlaylistSong";

export const seedTestData = async () => {
  const ds = AppDataSource;

  const user = ds.getRepository(User).create({
    username: 'TestUser',
    email: 'test@example.com',
    password_hash: 'hash',
  });
  await ds.manager.save(user);

  const song = ds.getRepository(Song).create({
    title: 'Test song',
    audio_url: 'https://www.mfiles.co.uk/mp3-downloads/gs-cd-track2.mp3',
  });
  await ds.manager.save(song);

  const playlist = ds.getRepository(Playlist).create({
    name: 'Test playlist',
    owner: user,
  });
  await ds.manager.save(playlist);

  await ds.getRepository(PlaylistSong).save({
    playlist,
    song,
    order_index: 1,
  });

  return { user, song, playlist };
};
