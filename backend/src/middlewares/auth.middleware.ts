// backend/src/middlewares/auth.middleware.ts
import { Request, Response, NextFunction } from "express";
import AppError from "./AppError";
import { verifyAccessToken } from "../utils/jwt";

export interface AuthReq extends Request { user?: { userId: number; role: string } }

export function requireAuth(req:AuthReq,res:Response,next:NextFunction) {
  const hdr = req.headers.authorization;     
  if (!hdr?.startsWith("Bearer ")) return next(new AppError(
    401, 
    "auth/missing-token", 
    "Brak tokenu autoryzacyjnego",
    "authorization"
  ));
  try {
    const payload:any = verifyAccessToken(hdr.slice(7));
    req.user = {
      userId: payload.sub,
      role: payload.role
    };
    next();
  } catch {
    next(new AppError(
      401, 
      "auth/invalid-token", 
      "Nieprawidłowy lub przedawniony token",
      "token"
    ));
  }
}



