import express from "express";
import path from "path";
import { playlistRouter } from "./routes/playlist.controller";
import errorHandler from "./middlewares/error.middleware";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./docs/swagger";
import dotenv from 'dotenv';
import cors         from "cors";
import cookieParser from 'cookie-parser';
import { authRouter } from './routes/auth.controller';
import { accountRouter } from "./routes/account.controller";
import { adminRouter } from "./routes/admin.controller";
import "dotenv/config";


dotenv.config();
export const app = express();
app.use(express.json());
app.use("/api", playlistRouter);
app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use("/api/account", accountRouter);
app.use("/api/admin", adminRouter);
app.use(errorHandler);
app.use(cors({
  origin: "http://localhost:3000", 
  credentials: true,
  exposedHeaders: ['X-Error-Code', 'X-Error-Field'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(cookieParser());
app.use('/api/auth', authRouter);
import { Request, Response, NextFunction } from "express";
import AppError from "./middlewares/AppError";

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      error: {
        code: err.code,
        field: err.field,
        message: err.message
      }
    });
  }
  
  res.status(500).json({
    error: {
      code: "internal-error",
      message: "Wewnętrzny błąd serwera"
    }
  });
});

// produkcyjny frontend – jeśli potrzebujesz
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../../frontend/build")));
  app.get("*", (_, res) =>
    res.sendFile(path.join(__dirname, "../../frontend/build/index.html"))
  );
}