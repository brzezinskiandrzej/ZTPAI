import { Request, Response, NextFunction } from "express";
import AppError from "./AppError";

export default function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  res.setHeader('Content-Type', 'application/json');
  
  console.error('Error handler received:', {
    name: err.name,
    message: err.message,
    stack: err.stack,
    isAppError: err instanceof AppError
  });
  console.log('Error details:', {
    url: req.originalUrl,
    method: req.method,
    error: err.message,
    stack: err.stack
  });
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      error: {
        code: err.code,
        message: err.message,
        field: err.field
      }
    });
  }

  // Dla nieoczekiwanych błędów
  console.error("Unhandled error:", err);
  res.status(500).json({
    error: {
      code: "internal-error",
      message: "Wewnętrzny błąd serwera",
      details: process.env.NODE_ENV === 'development' ? err.stack : undefined
    }
  });
}