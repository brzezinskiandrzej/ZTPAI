import express from "express";
import path from "path";
import { playlistRouter } from "./routes/playlist.controller";
import { errorHandler } from "./middlewares/error.middleware";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "../swagger";
import dotenv from 'dotenv';
import cors         from "cors";
import cookieParser from 'cookie-parser';
import { authRouter } from './routes/auth.controller';
import "dotenv/config";


dotenv.config();
export const app = express();
app.use(express.json());
app.use("/api", playlistRouter);
app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use(errorHandler);
app.use(cors({
  origin: ["http://localhost","http://localhost:80"],   // url, z którego serwujesz frontend
  credentials: true
}));
app.use(cookieParser());
app.use('/api/auth', authRouter);
app.use(cors({ origin: "http://localhost:3000", credentials: true }));

// produkcyjny frontend – jeśli potrzebujesz
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../../frontend/build")));
  app.get("*", (_, res) =>
    res.sendFile(path.join(__dirname, "../../frontend/build/index.html"))
  );
}