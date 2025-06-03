import request from "supertest";
import { app } from "../src/app";
import { fx }  from "./setup";

describe("ACCOUNT endpoints", () => {
  it("GET /account (autoryzacja) → 200", async () => {
    await request(app)
      .get("/api/account")
      .set("Authorization", `Bearer ${fx.token}`)
      .expect(200)
      .expect(r => expect(r.body.username).toBe(fx.user.username));
  });

  it("PATCH /account/password BEZ tokena → 401", async () => {
    await request(app)
      .patch("/api/account/password")
      .send({ oldPassword: "a", newPassword: "b" })
      .expect(401);
  });
});
