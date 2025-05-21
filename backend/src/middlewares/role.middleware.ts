import { NextFunction, Response } from "express";
import { AuthReq } from "./auth.middleware";
import AppError   from "./AppError";

export const requireRole =
  (...roles: string[]) =>
  (req: AuthReq, _res: Response, next: NextFunction) => {
    if (!req.user) return next(new AppError(401,"auth/unauthorized","Musisz być zalogowany"));
    if (!roles.includes(req.user.role))
      return next(new AppError(403,"auth/forbidden","Brak uprawnień"));
    next();
  };
