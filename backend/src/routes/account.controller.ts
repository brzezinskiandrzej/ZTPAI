// backend/src/routes/account.controller.ts
import { Router } from "express";
import bcrypt from "bcryptjs";
import { AppDataSource } from "../database/config/data-source";
import { requireAuth, AuthReq } from "../middlewares/auth.middleware";
import { User }       from "../models/User";
import { LikedSong }  from "../models/LikedSong";
import { Playlist }   from "../models/Playlist";
import AppError       from "../middlewares/AppError";

export const accountRouter = Router().use(requireAuth);

const userRepo  = () => AppDataSource.getRepository(User);
const likedRepo = () => AppDataSource.getRepository(LikedSong);
const plRepo    = () => AppDataSource.getRepository(Playlist);

/**
 * @openapi
 * /account:
 *   get:
 *     tags: [Account]
 *     summary: Returns the currently logged-in user
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Logged-in user data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       401:
 *         description: Missing / invalid token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
accountRouter.get("/", async (req:AuthReq,res)=> {
  const u = await userRepo().findOneBy({ user_id: req.user!.userId });
  res.json({ id:u!.user_id, username:u!.username, email:u!.email });
});

/**
 * @openapi
 * /account:
 *   patch:
 *     tags: [Account]
 *     summary: Updates username and / or e-mail
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 example: newName
 *               email:
 *                 type: string
 *                 example: new@mail.com
 *     responses:
 *       200:
 *         description: Updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: updated
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       422:
 *         $ref: '#/components/responses/Unprocessable'
 */
accountRouter.patch("/", async (req:AuthReq,res,next)=>{
  try{
    const { username,email } = req.body;
    if (!username && !email)
      throw new AppError(400,"validation/missing-fields","Brak danych do aktualizacji","global");

    const user = await userRepo().findOneBy({ user_id:req.user!.userId });
    if (!user) throw new AppError(404,"account/not-found","Użytkownik nie istnieje","global");

    if (username) user.username = username;
    if (email)    user.email    = email;
    await userRepo().save(user);

    res.json({ message:"updated", user:{ username:user.username, email:user.email }});
  }catch(e){ next(e); }
});

/**
 * @openapi
 * /account/password:
 *   patch:
 *     tags: [Account]
 *     summary: Changes the user password
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [oldPassword, newPassword]
 *             properties:
 *               oldPassword:
 *                 type: string
 *                 format: password
 *               newPassword:
 *                 type: string
 *                 format: password
 *     responses:
 *       200:
 *         description: Password updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: password-updated
 *       400: { $ref: '#/components/responses/BadRequest' }
 *       401: { $ref: '#/components/responses/Unauthorized' }
 *       404: { $ref: '#/components/responses/NotFound' }
 *       422: { $ref: '#/components/responses/Unprocessable' }
 */
accountRouter.patch("/password", async (req:AuthReq,res,next)=>{
  try{
    const { oldPassword,newPassword } = req.body;
    if (!oldPassword||!newPassword)
      throw new AppError(400,"validation/missing-fields","Brak haseł","global");

    const user = await userRepo().findOneBy({ user_id:req.user!.userId });
    if (!user) throw new AppError(404,"account/not-found","Użytkownik nie istnieje","global");

    if (!await bcrypt.compare(oldPassword, user.password_hash))
      throw new AppError(401,"auth/invalid-password","Nieprawidłowe hasło","oldPassword");

    if (newPassword.length<8)
      throw new AppError(422,"auth/invalid-password-format","Minimum 8 znaków","newPassword");

    user.password_hash = await bcrypt.hash(newPassword,10);
    await userRepo().save(user);
    res.json({ message:"password-updated" });
  }catch(e){ next(e); }
});

/**
 * @openapi
 * /account/likes:
 *   get:
 *     tags: [Account]
 *     summary: Returns liked tracks
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Track'
 *       401: { $ref: '#/components/responses/Unauthorized' }
 */
accountRouter.get("/likes", async (req:AuthReq,res)=>{
  const rows = await likedRepo().find({
    where:{ user_id:req.user!.userId },
    relations:["song","song.artist"]
  });
  res.json(rows.map(l=>({
    id:l.song.song_id, title:l.song.title, artist:l.song.artist?.name
  })));
});

/**
 * @openapi
 * /account/playlists:
 *   get:
 *     tags: [Account]
 *     summary: Returns playlists created by the user
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Playlist'
 *       401: { $ref: '#/components/responses/Unauthorized' }
 */
accountRouter.get("/playlists", async (req:AuthReq,res)=>{
  const pls = await plRepo().find({ where:{ owner:{ user_id:req.user!.userId }}});
  res.json(pls.map(p=>({ id:p.playlist_id, name:p.name })));
});
