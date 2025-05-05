import request from 'supertest';
import { fixtures } from "./setup";
import { app } from "../src/app";   
import { AppDataSource } from "../src/database/config/data-source";
import { Song } from "../src/models/Song";




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
          .expect(200);
      
        const updated = await AppDataSource
          .getRepository(Song)
          .findOneBy({ song_id: fixtures.song.song_id });
      
        expect(updated!.play_count).toBe(1);
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
});
