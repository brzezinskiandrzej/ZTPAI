// backend/src/middlewares/auth.middleware.ts
import { Request, Response, NextFunction } from "express";
import AppError from "./AppError";
import { verifyAccessToken } from "../utils/jwt";

export function isAuth(req: Request, _res: Response, next: NextFunction) {
  const auth = req.headers["authorization"];
  if (!auth) throw new AppError(401, "Brak nagłówka Authorization");
  const token = auth.split(" ")[1];
  try {
    const payload: any = verifyAccessToken(token);
    req.user = { userId: payload.userId, role: payload.role };
    next();
  } catch {
    throw new AppError(401, "Nieprawidłowy token");
  }
}

export function hasRole(...roles: string[]) {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) throw new AppError(401, "Brak uwierzytelnienia");
    if (!roles.includes(req.user.role)) throw new AppError(403, "Brak uprawnień");
    next();
  };
}
