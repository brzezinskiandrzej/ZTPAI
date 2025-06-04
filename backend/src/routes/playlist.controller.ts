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
 * @openapi
 * /playlist/mine:
 *   get:
 *     tags: [Playlist]
 *     summary: Zwraca listę playlist zalogowanego użytkownika
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: OK
 *       401: { $ref: '#/components/responses/Unauthorized' }
 *       403: { $ref: '#/components/responses/Forbidden' }
 */
playlistRouter.get(
  "/playlist/mine",
  requireAuth,
  async (req: AuthReq, res, next) => {
    try {
      const data = await srv.getSavedPlaylists(req.user!.userId);
      res.json(data);
    } catch (e) { next(e); }
  }
);

/**
 * @openapi
 * /playlist/{userId}/liked:
 *   get:
 *     tags: [Playlist]
 *     summary: Lista ulubionych utworów wybranego użytkownika
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:      { type: integer, example: 42 }
 *                   title:   { type: string,  example: "Yellow" }
 *                   artist:  { type: string,  example: "Coldplay" }
 *                   artwork: { type: string,  nullable: true }
 *       401: { $ref: '#/components/responses/Unauthorized' }
 *       403: { $ref: '#/components/responses/Forbidden' }
 */
playlistRouter.get(
  "/playlist/:userId/liked",
  requireAuth,
  validateNumericId("userId"),
  async (req: AuthReq, res, next) => {
    try {
      const ownerId = +req.params.userId;
      if (req.user!.userId !== ownerId && req.user!.role !== "admin")
        return res.status(403).json({ error: "Forbidden" });

      const data = await srv.getLikedSongs(ownerId);
      res.json(data);
    } catch (e) { next(e); }
  }
);

/**
 * @openapi
 * /playlist/{userId}/{playlistId}:
 *   get:
 *     tags: [Playlist]
 *     summary: Pobiera pojedynczą playlistę użytkownika
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema: { type: integer }
 *       - in: path
 *         name: playlistId
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: OK }
 *       401: { $ref: '#/components/responses/Unauthorized' }
 *       403: { $ref: '#/components/responses/Forbidden' }
 *       404: { $ref: '#/components/responses/NotFound' }
 */
playlistRouter.get(
  "/playlist/:userId/:playlistId",
  requireAuth,
  validateNumericId("userId"),
  validateNumericId("playlistId"),
  async (req: AuthReq, res, next) => {
    try {
      const ownerId    = +req.params.userId;
      const playlistId = +req.params.playlistId;

      if (req.user!.userId !== ownerId && req.user!.role !== "admin")
        return res.status(403).json({ error: "Forbidden" });

      const data = await srv.getUserPlaylist(ownerId, playlistId);
      res.json(data);
    } catch (e) { next(e); }
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
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 playCount: { type: integer, example: 57 }
 *       401: { $ref: '#/components/responses/Unauthorized' }
 *       404: { $ref: '#/components/responses/NotFound' }
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
 *     summary: Dodaje lub usuwa utwór z ulubionych
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
 *               isFavorite:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       201:
 *         description: Dodano do ulubionych
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 trackId:    { type: integer }
 *                 isFavorite: { type: boolean }
 *       200:
 *         description: Usunięto z ulubionych
 *       401: { $ref: '#/components/responses/Unauthorized' }
 *       422: { $ref: '#/components/responses/Unprocessable' }
 *       404: { $ref: '#/components/responses/NotFound' }
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







