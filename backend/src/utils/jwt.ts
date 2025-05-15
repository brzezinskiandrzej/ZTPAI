// src/utils/jwt.ts
import { assertIsString } from "./assert";
import jwt, { SignOptions, JwtPayload } from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

assertIsString(process.env.ACCESS_TOKEN_SECRET,  "ACCESS_TOKEN_SECRET");
assertIsString(process.env.REFRESH_TOKEN_SECRET, "REFRESH_TOKEN_SECRET");

// tu ✨ rzutujemy – od tej pory to czysty string
const accessTokenSecret  = process.env.ACCESS_TOKEN_SECRET;
const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET;

const accessTokenExpiry  = process.env.ACCESS_TOKEN_EXPIRY  || "15m";
const refreshTokenExpiry = process.env.REFRESH_TOKEN_EXPIRY || "7d";

export function signAccessToken(payload: object): string {
  return jwt.sign(payload, accessTokenSecret,  { expiresIn: accessTokenExpiry  } as SignOptions);
}

export function signRefreshToken(payload: object): string {
  return jwt.sign(payload, refreshTokenSecret, { expiresIn: refreshTokenExpiry } as SignOptions);
}

export function verifyAccessToken(token: string): JwtPayload {
  return jwt.verify(token, accessTokenSecret)  as JwtPayload;
}

export function verifyRefreshToken(token: string): JwtPayload {
  return jwt.verify(token, refreshTokenSecret) as JwtPayload;
}
