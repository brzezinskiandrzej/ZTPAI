import { Request, Response, NextFunction } from "express";
import AppError from "./AppError";

export const validateNumericId =
  (param: string) =>
  (req: Request, _res: Response, next: NextFunction) => {
    if (!/^\d+$/.test(req.params[param])) {
      throw new AppError(400, "validation/invalid-id",`${param} must be numeric`,param);
    }
    next();
  };