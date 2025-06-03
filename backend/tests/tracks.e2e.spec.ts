import request from "supertest";
import jwt     from "jsonwebtoken";
import { app } from "../src/app";
import { fx }  from "./setup";
import { Song } from "../src/models/Song";

let track: Song;

beforeAll(() => { track = fx.song; });

describe("TRACK endpoints", () => {

  it("POST /tracks/:id/play → 200 i +1 play_count", async () => {
    const { body } = await request(app)
      .post(`/api/tracks/${track.song_id}/play`)
      .set("Authorization", `Bearer ${fx.token}`)
      .expect(200);

    expect(body.playCount).toBe(1);
  });

  it("POST /tracks/:id/favorite → 201 (dodaje)", async () => {
    await request(app)
      .post(`/api/tracks/${track.song_id}/favorite`)
      .set("Authorization", `Bearer ${fx.token}`)
      .send({ isFavorite: true })
      .expect(201);
  });

  it("… i 200 (usuwa)", async () => {
    await request(app)
      .post(`/api/tracks/${track.song_id}/favorite`)
      .set("Authorization", `Bearer ${fx.token}`)
      .send({ isFavorite: false })
      .expect(200);
  });

  it("… 422 gdy isFavorite ≠ boolean", async () => {
    await request(app)
      .post(`/api/tracks/${track.song_id}/favorite`)
      .set("Authorization", `Bearer ${fx.token}`)
      .send({ isFavorite: "yes" })
      .expect(422);
  });
});
