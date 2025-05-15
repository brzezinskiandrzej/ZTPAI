// backend/src/middlewares/auth.middleware.ts
import { Request, Response, NextFunction } from "express";
import AppError from "./AppError";
import { verifyAccessToken } from "../utils/jwt";

export interface AuthReq extends Request { user?: { userId: number; role: string } }

export function requireAuth(req:AuthReq,res:Response,next:NextFunction) {
  const hdr = req.headers.authorization;     
  if (!hdr?.startsWith("Bearer ")) return next(new AppError(401, "Missing token"));
  try {
    const payload:any = verifyAccessToken(hdr.slice(7));
    (req as any).userId = payload.sub;
    (req as any).role   = payload.role;
    next();
  } catch {
    next(new AppError(401, "Invalid / expired token"));
  }
}



