import { Router } from "express";
import bcrypt   from "bcryptjs";
import { signAccessToken, signRefreshToken, verifyRefreshToken } from "../utils/jwt";
import { AppDataSource } from "../database/config/data-source";
import { User } from "../models/User";

export const authRouter = Router();
const userRepo = () => AppDataSource.getRepository(User);

// *****  POST /api/auth/register  *****
authRouter.post("/register", async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password)
      return res.status(400).json({ error: "Missing fields" });

    const exists = await userRepo().findOne({ where: [{ email }, { username }] });
    if (exists) return res.status(409).json({ error: "User already exists" });

    const password_hash = await bcrypt.hash(password, 10);
    const user = userRepo().create({ username, email, password_hash, role: "user" });
    await userRepo().save(user);

    return res.status(201).json({ message: "Account created" });
  } catch (err) { next(err); }
});

// *****  POST /api/auth/login  *****
authRouter.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await userRepo().findOneBy({ email });
    if (!user) return res.status(400).json({ error: "Invalid credentials" });

    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) return res.status(400).json({ error: "Invalid credentials" });

    // 1) access‑token w JS‑ie → header / pamięć aplikacji
    const access  = signAccessToken({ sub: user.user_id, role: user.role });
    // 2) refresh‑token w HttpOnly cookie
    const refresh = signRefreshToken({ sub: user.user_id });
    res.cookie("refreshToken", refresh, {
      httpOnly: true,
      sameSite : "strict",
      secure   : process.env.NODE_ENV === "production",
      maxAge   : 7 * 24 * 60 * 60 * 1000        // 7 dni
    });

    return res.json({ accessToken: access, user: { id: user.user_id, username: user.username, role: user.role } });
  } catch (err) { next(err); }
});

// *****  POST /api/auth/refresh –‑ wywoływane w tle  *****
authRouter.post("/refresh", async (req, res, next) => {
  try {
    const token = req.cookies.refreshToken;
    if (!token) return res.status(401).json({ error: "Missing refresh token" });

    const payload = verifyRefreshToken(token);
    const access  = signAccessToken({ sub: payload.sub, role: payload.role });
    res.json({ accessToken: access });
  } catch (err) { next(err); }
});

// *****  POST /api/auth/logout  *****
authRouter.post("/logout", (_req, res) => {
  res.clearCookie("refreshToken", { httpOnly: true, sameSite: "strict" });
  res.status(204).end();
});
