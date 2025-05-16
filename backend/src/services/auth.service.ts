// backend/src/services/auth.service.ts
import bcrypt from "bcrypt";
import { AppDataSource } from "../database/config/data-source";
import { User } from "../models/User";
import AppError from "../middlewares/AppError";
import { signAccessToken, signRefreshToken, verifyRefreshToken } from "../utils/jwt";
import { LikedSong } from "../models/LikedSong";
import { Playlist } from "../models/Playlist";

export interface Tokens { accessToken: string; refreshToken: string }

export async function register(email: string, username: string, password: string): Promise<Tokens> {
  const userRepo = AppDataSource.getRepository(User);
  if (await userRepo.findOneBy({ email })) throw new AppError(
    409,
    "auth/email-exists",
    "Adres email jest już zajęty",
    "email"
  );
  const hash = await bcrypt.hash(password, 10);
  const user = userRepo.create({ email, username, password_hash: hash });
  await userRepo.save(user);
  const payload = { userId: user.user_id, role: user.role };
  return { accessToken: signAccessToken(payload), refreshToken: signRefreshToken(payload) };
}

export async function login(email: string, password: string): Promise<Tokens> {
  const userRepo = AppDataSource.getRepository(User);
  const user = await userRepo.findOneBy({ email });
  if (!user) throw new AppError(
    401,
    "auth/invalid-credentials",
    "Nieprawidłowy email lub hasło",
    "email"
  );
  if (!await bcrypt.compare(password, user.password_hash)) throw new AppError(
    401,
    "auth/invalid-credentials",
    "Nieprawidłowy email lub hasło",
    "password"
  );
  const payload = { userId: user.user_id, role: user.role };
  return { accessToken: signAccessToken(payload), refreshToken: signRefreshToken(payload) };
}

export async function refreshTokens(token: string): Promise<Tokens> {
  let payload: any;
  try { payload = verifyRefreshToken(token); }
  catch { throw new AppError(
    401,
    "auth/invalid-refresh-token",
    "Nieprawidłowy token odświeżający",
    "refreshToken"
  ); }
  const userRepo = AppDataSource.getRepository(User);
  const user = await userRepo.findOneBy({ user_id: payload.userId });
  if (!user) throw new AppError(
    404,
    "auth/user-not-found",
    "Użytkownik nie istnieje",
    "userId"
  );
  const newPayload = { userId: user.user_id, role: user.role };
  return { accessToken: signAccessToken(newPayload), refreshToken: signRefreshToken(newPayload) };
}
