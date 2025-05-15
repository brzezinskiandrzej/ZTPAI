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
  if (await userRepo.findOneBy({ email })) throw new AppError(422, "E-mail już istnieje");
  const hash = await bcrypt.hash(password, 10);
  const user = userRepo.create({ email, username, password_hash: hash });
  await userRepo.save(user);
  const payload = { userId: user.user_id, role: user.role };
  return { accessToken: signAccessToken(payload), refreshToken: signRefreshToken(payload) };
}

export async function login(email: string, password: string): Promise<Tokens> {
  const userRepo = AppDataSource.getRepository(User);
  const user = await userRepo.findOneBy({ email });
  if (!user) throw new AppError(401, "Nieprawidłowe dane logowania");
  if (!await bcrypt.compare(password, user.password_hash)) throw new AppError(401, "Nieprawidłowe dane logowania");
  const payload = { userId: user.user_id, role: user.role };
  return { accessToken: signAccessToken(payload), refreshToken: signRefreshToken(payload) };
}

export async function refreshTokens(token: string): Promise<Tokens> {
  let payload: any;
  try { payload = verifyRefreshToken(token); }
  catch { throw new AppError(401, "Nieprawidłowy refresh token"); }
  const userRepo = AppDataSource.getRepository(User);
  const user = await userRepo.findOneBy({ user_id: payload.userId });
  if (!user) throw new AppError(404, "Użytkownik nie znaleziony");
  const newPayload = { userId: user.user_id, role: user.role };
  return { accessToken: signAccessToken(newPayload), refreshToken: signRefreshToken(newPayload) };
}
