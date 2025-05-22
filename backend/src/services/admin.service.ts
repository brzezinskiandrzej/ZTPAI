import { AppDataSource } from "../database/config/data-source";
import { User }          from "../models/User";
import { Playlist }      from "../models/Playlist";
import { publishAdminEvent } from "../queues/publish";
import { AdminLog }      from "../models/AdminLog";
import AppError          from "../middlewares/AppError";
import bcrypt            from "bcrypt";
type SortField = "date" | "name" | "songs";
type SortDir   = "asc"  | "desc";
const userRepo     = () => AppDataSource.getRepository(User);
const playlistRepo = () => AppDataSource.getRepository(Playlist);


export async function listUsers() {
  const repo = AppDataSource.getRepository(User);

  const rows = await repo
    .createQueryBuilder("u")
    .leftJoin("u.playlists", "p")
    .select([
      "u.user_id            AS id",
      "u.username           AS name",
      "u.email              AS email",
      "u.created_at         AS created",
      "u.is_banned          AS is_banned",
      "COUNT(p.playlist_id) AS playlistcount"
    ])
    .groupBy("u.user_id")        
    .addGroupBy("u.username")
    .addGroupBy("u.email")
    .addGroupBy("u.created_at")
    .getRawMany();

  return rows.map(r => ({
    id             : Number(r.id),
    username           : r.name,
    email          : r.email,
    created : (r.created as Date).toISOString().slice(0,10),
    playlistCount  : Number(r.playlistcount),
    is_banned     : !!r.is_banned
  }));
}
export async function banUser(adminId: number,targetUserId: number, ban:boolean) {
  const user = await userRepo().findOneBy({ user_id:adminId });
  if (!user) throw new AppError(404,"admin/user-not-found","Użytkownik nie istnieje");
  user.is_banned = ban;
  await userRepo().save(user);
  await publishAdminEvent(
    user.user_id,
    ban ? "BAN" : "UNBAN",
    targetUserId
  );
}
export async function resetPassword(id:number,newPass:string) {
  if (newPass.length<8) throw new AppError(422,"validation/weak-pass","Hasło za krótkie","password");
  const user = await userRepo().findOneBy({ user_id:id });
  if (!user) throw new AppError(404,"admin/user-not-found","Użytkownik nie istnieje");
  user.password_hash = await bcrypt.hash(newPass,10);
  await userRepo().save(user);
}


export async function getAllPlaylists(
  sort: SortField = "date",
  dir : SortDir   = "desc"
) {

  if (!["date","name","songs"].includes(sort))
    throw new AppError(400,"validation/invalid-sort","Sort must be date|name|songs","sort");
  if (!["asc","desc"].includes(dir))
    throw new AppError(400,"validation/invalid-dir","Dir must be asc|desc","dir");

  const repo  = AppDataSource.getRepository(Playlist);


  const qb = AppDataSource.getRepository(Playlist)
    .createQueryBuilder("pl")
    .leftJoin("pl.owner", "o")
    .leftJoin("pl.playlistSongs", "ps")
    .select([
      "pl.playlist_id              AS id",
      "pl.name                     AS name",
      "pl.created_at               AS created",
      "o.username                  AS owner",
      "COUNT(ps.song_id)           AS songcount"
    ])
    .groupBy("pl.playlist_id")
    .addGroupBy("pl.created_at")   
    .addGroupBy("o.username");


  const DIR = dir.toUpperCase() as "ASC" | "DESC";

  switch (sort) {
    case "name":  qb.orderBy("name",      DIR); break;
    case "songs": qb.orderBy("songCount", DIR); break;
    default:      qb.orderBy("created",   DIR);
  }


  const rows = await qb.getRawMany();

 
  return rows.map(r => ({
    id        : Number(r.id),
    name      : r.name,
    owner     : r.owner,
    songCount : Number(r.songcount),
    created   : r.created.toISOString().slice(0,10)
  }));
}
export async function deletePlaylist(id:number) {
  const ok = await playlistRepo().delete({ playlist_id:id });
  if (!ok.affected) throw new AppError(404,"admin/playlist-not-found","Playlista nie istnieje");
}

export async function listLogs() {
  return AppDataSource.getRepository(AdminLog).find({
    relations: ["actor"],           
    order: { id: "DESC" },         
    take: 100                       
  });
}
