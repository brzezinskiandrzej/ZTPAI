"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.playlistRouter = void 0;
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
// src/routes/playlist.controller.ts
const express_2 = require("express");
const validateId_1 = require("../middlewares/validateId");
const srv = __importStar(require("../services/playlist.service"));
const playlist_service_1 = require("../services/playlist.service");
exports.playlistRouter = (0, express_2.Router)();
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
exports.playlistRouter.get("/playlist/:userId", (0, validateId_1.validateNumericId)("userId"), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield srv.getUserPlaylist(+req.params.userId);
        res.status(200).json(data);
    }
    catch (e) {
        next(e);
    }
}));
// analogicznie POST /tracks/:id/play  & /tracks/:id/favorite
exports.playlistRouter.post("/tracks/:trackId/play", (0, validateId_1.validateNumericId)("trackId"), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield srv.incrementPlay(+req.params.trackId);
        res.status(200).json(data); // ← zwracamy { playCount: … }
    }
    catch (e) {
        next(e);
    }
}));
exports.playlistRouter.post("/tracks/:trackId/favorite", (0, validateId_1.validateNumericId)("trackId"), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = +(req.query.userId || 1);
        const trackId = +req.params.trackId;
        const { isFavorite } = req.body;
        if (typeof isFavorite !== "boolean")
            return res.status(422).json({ error: "`isFavorite` must be boolean" });
        const payload = yield (0, playlist_service_1.toggleFavorite)(userId, trackId, isFavorite);
        res.status(isFavorite ? 201 : 200).json(payload); // <‑‑ payload ma klucz isFavorite
    }
    catch (e) {
        next(e);
    }
}));
