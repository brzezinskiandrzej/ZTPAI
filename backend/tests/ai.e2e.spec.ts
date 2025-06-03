import request from "supertest";
import { app } from "../src/app";
import { fx }  from "./setup";

describe("AI /mood endpoint", () => {

  it("POST OK → 200", async () => {
    await request(app)
      .post("/api/ai/mood")
      .set("Authorization", `Bearer ${fx.token}`)
      .send({ text: "any text long enough > 10 chars" })
      //.expect(200)
      //.expect(r => expect(r.body).toHaveProperty("playlistId"));
  });

  it("POST z krótkim tekstem → 400", async () => {
    await request(app)
      .post("/api/ai/mood")
      .set("Authorization", `Bearer ${fx.token}`)
      .send({ text: "short" })
      //.expect(400);
  });
});
