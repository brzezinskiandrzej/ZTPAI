import request from "supertest";
import jwt     from "jsonwebtoken";
import { app } from "../src/app";
import { fx }  from "./setup";

let adminToken: string;

beforeAll(() => {
  adminToken = jwt.sign(
    { sub: fx.user.user_id, role: "admin", username: "Admin" },
    process.env.ACCESS_TOKEN_SECRET!,
    { expiresIn: "1h" }
  );
});

describe("ADMIN endpoints", () => {
  it("GET /admin/users → 200", async () => {
    await request(app)
      .get("/api/admin/users")
      .set("Authorization", `Bearer ${adminToken}`)
      .expect(200);
  });

  it("GET /admin/logs  → 200", async () => {
    await request(app)
      .get("/api/admin/logs")
      .set("Authorization", `Bearer ${adminToken}`)
      .expect(200);
  });
});
