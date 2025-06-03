// tests/playlist.e2e.spec.ts -----------------------------------------------
import request from "supertest";
import { app } from "../src/app";
import { fx }  from "./setup";
import { AppDataSource } from "../src/database/config/data-source";
import { LikedSong }    from "../src/models/LikedSong";

const auth = (req: request.Test) =>
  req.set("Authorization", `Bearer ${fx.token}`);

describe("Playlist API", () => {
  /* ---- GET /api/playlist/:uid/:pid ---- */
  it("zwraca playlistę właściciela (200)", async () => {
    const res = await auth(
      request(app).get(`/api/playlist/${fx.user.user_id}/${fx.playlist.playlist_id}`)
    ).expect(200);

    expect(res.body.tracks).toHaveLength(1);
    expect(res.body.username).toBe(fx.user.username);

  });

  it("GET dla nie-numerycznego uid → 400", async () => {
    await auth(request(app).get("/api/playlist/abc/1")).expect(400);
  });

  it("GET 404 gdy brak playlisty", async () => {
    await auth(request(app)
      .get(`/api/playlist/${fx.user.user_id}/9999`)).expect(404);
  });

  /* ---- POST /api/tracks/:id/play ---- */
  it("inkrementuje play_count", async () => {
    const res = await auth(
      request(app).post(`/api/tracks/${fx.song.song_id}/play`)
    ).expect(200);

    expect(res.body.playCount).toBe(1);
  });

  /* ---- POST /api/tracks/:id/favorite ---- */
  it("dodaje i usuwa ulubione", async () => {
    const favURL = `/api/tracks/${fx.song.song_id}/favorite`;

    await auth(request(app)
      .post(favURL)
      .send({ isFavorite: true })
    ).expect(201);

    const likeRepo = AppDataSource.getRepository(LikedSong);
    expect(
      await likeRepo.findOneBy({ user_id: fx.user.user_id, song_id: fx.song.song_id })
    ).not.toBeNull();

    await auth(request(app)
      .post(favURL)
      .send({ isFavorite: false })
    ).expect(200);

    expect(
      await likeRepo.findOneBy({ user_id: fx.user.user_id, song_id: fx.song.song_id })
    ).toBeNull();
  });

  it("422 gdy isFavorite nie boolean", async () => {
    await auth(request(app)
      .post(`/api/tracks/${fx.song.song_id}/favorite`)
      .send({ isFavorite: "yes" })
    ).expect(422);
  });
});
