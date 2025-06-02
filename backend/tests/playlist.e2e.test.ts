import request from 'supertest';
import { fixtures } from "./setup";
import { app } from "../src/app";   
import { AppDataSource } from "../src/database/config/data-source";
import { Song } from "../src/models/Song";
import { DataSource } from 'typeorm';
import { LikedSong } from '../src/models/LikedSong';




describe('Playlist endpoints', () => {
    it("GET zwraca playlistę 200", async () => {
        const res = await request(app)
          .get(`/api/playlist/${fixtures.user.user_id}`)
          .expect(200);
    
        expect(res.body.username).toBe(fixtures.user.username);
        expect(res.body.tracks).toHaveLength(1);
      });

      it("POST play inkrementuje play_count", async () => {
        await request(app)
          .post(`/api/tracks/${fixtures.song.song_id}/play`)
          .expect(200)
          .expect(res => {
            expect(res.body.playCount).toBe(1);
          });
      });
      
      
      
      
      
  it("GET z nienumerycznym userId → 400", async () => {
    await request(app).get("/api/playlist/abc").expect(400);
  });
  it("GET 404 dla nieistniejącego usera", async () => {
    await request(app).get("/api/playlist/9999").expect(404);
  });
    it("POST favorite z nienumerycznym trackId → 400", async () => {
        await request(app)
        .post("/api/tracks/abc/favorite")
        .send({ isFavorite: true })
        .expect(400);
    });

    it("dodaje i usuwa polubienie", async () => {
        await request(app)
          .post(`/api/tracks/${fixtures.song.song_id}/favorite?userId=${fixtures.user.user_id}`)
          .send({ isFavorite: true })
          .expect(201);
    
        const likeRepo = AppDataSource.getRepository(LikedSong);
        expect(
          await likeRepo.findOneBy({
            user_id: fixtures.user.user_id,
            song_id: fixtures.song.song_id,
          })
        ).not.toBeNull();
    
        await request(app)
          .post(`/api/tracks/${fixtures.song.song_id}/favorite?userId=${fixtures.user.user_id}`)
          .send({ isFavorite: false })
          .expect(200);
    
        expect(
          await likeRepo.findOneBy({
            user_id: fixtures.user.user_id,
            song_id: fixtures.song.song_id,
          })
        ).toBeNull();
      });
    
      it("zwraca 404 dla nieistniejącego utworu", async () => {
        const missingId = fixtures.song.song_id + 1000;
        await request(app)
          .post(`/api/tracks/${missingId}/favorite?userId=1`)
          .send({ isFavorite: true })
          .expect(404);
      });
    
      it("zwraca 422 gdy isFavorite nie jest booleanem", async () => {
        await request(app)
          .post(`/api/tracks/${fixtures.song.song_id}/favorite?userId=1`)
          .send({ isFavorite: "yes" })
          .expect(422);
      });
});
