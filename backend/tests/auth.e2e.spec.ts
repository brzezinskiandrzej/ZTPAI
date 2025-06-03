import request from "supertest";
import { app } from "../src/app";

const API = "/api/auth";

describe("AUTH endpoints", () => {
  const email = `jest_${Date.now()}@test.com`;
  const pass  = "P@ssw0rd123";

  it("POST /register → 201", async () => {
    await request(app)
      .post(`${API}/register`)
      .send({ username: "JestUser", email, password: pass })
      .expect(201);
  });

  it("POST /register → 400 (brak pól)", async () => {
    await request(app).post(`${API}/register`).send({}).expect(400);
  });

  it("POST /login  → 200", async () => {
    await request(app)
      .post(`${API}/login`)
      .send({ email, password: pass })
      .expect(200)
      .expect(r => expect(r.body).toHaveProperty("accessToken"));
  });

  it("POST /login  → 401 (złe hasło)", async () => {
    await request(app)
      .post(`${API}/login`)
      .send({ email, password: "wrong" })
      .expect(401);
  });
});
