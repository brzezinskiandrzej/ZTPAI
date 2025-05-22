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
  "/playlist/mine",
  requireAuth,
  async (req:AuthReq, res, next) => {
    try {
      const data = await srv.getSavedPlaylists(req.user!.userId);
      res.json(data);                        
    } catch (e) { next(e); }
  }
);
/**
 * @openapi
 * /playlist/{userId}:
 *   get:
 *     tags: [Playlist]
 *     summary: Pełna play-lista użytkownika
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: OK }
 *       403: { $ref: '#/components/schemas/Error' }
 *       404: { $ref: '#/components/schemas/Error' }
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

/**
 * @openapi
 * /tracks/{trackId}/play:
 *   post:
 *     tags: [Playlist]
 *     summary: Inkrementuje licznik odtworzeń utworu
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: trackId
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: OK }
 *       401: { $ref: '#/components/schemas/Error' }
 */
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
/**
 * @openapi
 * /tracks/{trackId}/favorite:
 *   post:
 *     tags: [Playlist]
 *     summary: Dodaje/usuwa ulubione
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: trackId
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [isFavorite]
 *             properties:
 *               isFavorite: { type: boolean }
 *     responses:
 *       201: { description: Dodano do ulubionych }
 *       200: { description: Usunięto z ulubionych }
 *       401: { $ref: '#/components/schemas/Error' }
 *       422: { $ref: '#/components/schemas/Error' }
 */
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





