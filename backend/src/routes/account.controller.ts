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

/* ----------  GET /api/account  ---------- */
accountRouter.get("/", async (req:AuthReq,res)=> {
  const u = await userRepo().findOneBy({ user_id: req.user!.userId });
  res.json({ id:u!.user_id, username:u!.username, email:u!.email });
});

/* ----------  PATCH /api/account  (username / email) ---------- */
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

/* ----------  PATCH /api/account/password  ---------- */
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

/* ----------  GET /api/account/likes  ---------- */
accountRouter.get("/likes", async (req:AuthReq,res)=>{
  const rows = await likedRepo().find({
    where:{ user_id:req.user!.userId },
    relations:["song","song.artist"]
  });
  res.json(rows.map(l=>({
    id:l.song.song_id, title:l.song.title, artist:l.song.artist?.name
  })));
});

/* ----------  GET /api/account/playlists  ---------- */
accountRouter.get("/playlists", async (req:AuthReq,res)=>{
  const pls = await plRepo().find({ where:{ owner:{ user_id:req.user!.userId }}});
  res.json(pls.map(p=>({ id:p.playlist_id, name:p.name })));
});
