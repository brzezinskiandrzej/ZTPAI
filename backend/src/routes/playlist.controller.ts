import express from "express";
import { Request, Response } from "express";
import { AppDataSource } from "../database/config/data-source";
import { User } from "../models/User";
import { Playlist } from "../models/Playlist";
import { PlaylistSong } from "../models/PlaylistSong";
import { Song } from "../models/Song";
import { LikedSong } from "../models/LikedSong";
import { url } from "inspector";
import { isNumeric } from "../utils/isNumeric";
import { isBoolean } from "../utils/isBoolean";
import { requireAuth, AuthReq } from "../middlewares/auth.middleware";

const router = express.Router();



// src/routes/playlist.controller.ts
import { Router } from "express";
import { validateNumericId } from "../middlewares/validateId";
import * as srv from "../services/playlist.service";
import { toggleFavorite } from "../services/playlist.service";


export const playlistRouter = Router();

/**
 * @swagger
 * /api/playlist/{userId}:
 *   get:
 *     summary: Get user playlist
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema: { type: integer }
 *     responses:
 *       200: { description: Success }
 *       400: { description: Bad Request }
 *       404: { description: Not Found }
 */
playlistRouter.get(
  "/playlist/:userId",
  requireAuth,
  validateNumericId("userId"),
  async (req: AuthReq, res, next) => {
    try {
      const requested = Number(req.params.userId);
      if (req.user!.userId !== requested && req.user!.role !== "admin")
        return res.status(403).json({ error: "Forbidden" });

      const data = await srv.getUserPlaylist(requested)
      res.json(data);
    } catch (e) {
      next(e);
    }
  }
);

// analogicznie POST /tracks/:id/play  & /tracks/:id/favorite
playlistRouter.post(
  "/tracks/:trackId/play",
  requireAuth,
  validateNumericId("trackId"),
  async (req, res, next) => {
    try {
      const data = await srv.incrementPlay(+req.params.trackId);
      res.status(200).json(data);          // ← zwracamy { playCount: … }
    } catch (e) {
      next(e);
    }
  }
);
playlistRouter.post(
  "/tracks/:trackId/favorite",
  requireAuth,
  validateNumericId("trackId"),
  async (req, res, next) => {
    try {
      const userId = req.user!.userId;

      const trackId    = +req.params.trackId;
      const { isFavorite } = req.body;

      if (typeof isFavorite !== "boolean")
        return res.status(422).json({ error: "`isFavorite` must be boolean" });

      const payload = await toggleFavorite(userId, trackId, isFavorite);
      res.status(isFavorite ? 201 : 200).json(payload);   // <‑‑ payload ma klucz isFavorite
    } catch (e) {
      next(e);
    }
  }
);




