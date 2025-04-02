import "reflect-metadata";
import { AppDataSource } from "../config/data-source";
import { User } from "../../models/User";
import { Artist } from "../../models/Artist";
import { Song } from "../../models/Song";
import { Playlist } from "../../models/Playlist";
import { PlaylistSong } from "../../models/PlaylistSong";

async function seedData() {
  await AppDataSource.initialize();
  console.log("Data Source initialized... seeding data now.");

  const userRepo = AppDataSource.getRepository(User);

  const andrew = userRepo.create({
    username: "Andrew",
    email: "andrew@example.com",
    password_hash: "secret", 
    role: "user",
  });
  await userRepo.save(andrew);

  const barbara = userRepo.create({
    username: "Barbara",
    email: "barbara@example.com",
    password_hash: "secret",
    role: "user",
  });
  await userRepo.save(barbara);

  const artistRepo = AppDataSource.getRepository(Artist);

  const coldplay = artistRepo.create({ 
    name: "Coldplay",
    bio: "Famous British rock band..."
  });
  await artistRepo.save(coldplay);

  const edSheeran = artistRepo.create({
    name: "Ed Sheeran",
    bio: "English singer-songwriter..."
  });
  await artistRepo.save(edSheeran);

  const songRepo = AppDataSource.getRepository(Song);

  const s1 = songRepo.create({
    title: "Shiver",
    artwork_url: "https://placehold.co/40x40/607d8b/607d8b",
    play_count: 0,
    artist_id: coldplay.artist_id,  
    audio_url: "https://www.mfiles.co.uk/mp3-downloads/gs-cd-track2.mp3"
  });
  await songRepo.save(s1);

  const s2 = songRepo.create({
    title: "Yellow",
    artwork_url: "https://placehold.co/40x40/673ab7/673ab7",
    play_count: 0,
    artist_id: coldplay.artist_id,
    audio_url: "https://www.mfiles.co.uk/mp3-downloads/i-do-like-to-be-beside-the-seaside.mp3"
  });
  await songRepo.save(s2);

  const s3 = songRepo.create({
    title: "The Scientist",
    artwork_url: "https://placehold.co/40x40/90a4ae/90a4ae",
    play_count: 0,
    artist_id: coldplay.artist_id,
    audio_url: "https://www.mfiles.co.uk/mp3-downloads/polly-perkins-of-paddington-green.mp3"
  });
  await songRepo.save(s3);

  const s4 = songRepo.create({
    title: "Fix You",
    artwork_url: "https://placehold.co/40x40/f44336/f44336",
    play_count: 0,
    artist_id: coldplay.artist_id,
    audio_url: "https://www.mfiles.co.uk/mp3-downloads/the-man-who-broke-the-bank-at-monte-carlo.mp3"
  });
  await songRepo.save(s4);

  const s5 = songRepo.create({
    title: "Viva La Vida",
    artwork_url: "https://placehold.co/40x40/eceff1/eceff1",
    play_count: 0,
    artist_id: coldplay.artist_id,
    audio_url: "https://www.mfiles.co.uk/mp3-downloads/its-a-long-long-way-to-tipperary.mp3"
  });
  await songRepo.save(s5);

  const s6 = songRepo.create({
    title: "Perfect",
    artwork_url: "https://placehold.co/40x40/9c27b0/9c27b0",
    play_count: 0,
    artist_id: edSheeran.artist_id,
    audio_url: "https://www.mfiles.co.uk/mp3-downloads/lets-all-go-down-the-strand.mp3"
  });
  await songRepo.save(s6);

  const playlistRepo = AppDataSource.getRepository(Playlist);
  const p1 = playlistRepo.create({
    owner: andrew,
    name: "Your Today's Moody Playlist"
  });
  await playlistRepo.save(p1);

  const psRepo = AppDataSource.getRepository(PlaylistSong);

  const trackIds = [s1.song_id, s2.song_id, s3.song_id, s4.song_id];
  let orderIndex = 0;

  for (const tid of trackIds) {
    const ps = psRepo.create({
      playlist_id: p1.playlist_id,
      song_id: tid,
      order_index: orderIndex++
    });
    await psRepo.save(ps);
  }

  const p2 = playlistRepo.create({
    owner: barbara,
    name: "Your Thursday's Happy Playlist"
  });
  await playlistRepo.save(p2);

  const trackIds2 = [s2.song_id, s3.song_id, s5.song_id, s6.song_id];
  orderIndex = 0;
  for (const tid of trackIds2) {
    const ps = psRepo.create({
      playlist_id: p2.playlist_id,
      song_id: tid,
      order_index: orderIndex++
    });
    await psRepo.save(ps);
  }

  console.log("Seeding done!");
  await AppDataSource.destroy();
}

if (require.main === module) {
  seedData().catch(err => console.error(err));
}

export { seedData };
