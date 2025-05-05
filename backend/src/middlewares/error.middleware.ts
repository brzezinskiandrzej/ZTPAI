import { Request, Response, NextFunction } from "express";
import AppError from "./AppError";

export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  if (err instanceof AppError) {
    return res.status(err.status).json({ error: err.message, status: err.status });
  }
  console.error(err);
  return res.status(500).json({ error: "Internal server error", status: 500 });
}


