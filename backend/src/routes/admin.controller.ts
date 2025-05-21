import { Router } from "express";
import { requireAuth }  from "../middlewares/auth.middleware";
import { requireRole }  from "../middlewares/role.middleware";
import { validateNumericId } from "../middlewares/validateId";
import * as adminSrv from "../services/admin.service";


export const adminRouter = Router();
adminRouter.use(requireAuth, requireRole("admin"));

/* ---- USERS ---- */
adminRouter.get(
  "/users",
  requireAuth,
  requireRole("admin"),
  async (_req, res, next) => {
    try { res.json(await adminSrv.listUsers()); }
    catch (e) { next(e); }
  }
);
adminRouter.patch("/users/:id/ban",
  validateNumericId("id"),
  async (req,res,next)=>{ try{
    await adminSrv.banUser(+req.params.id, !!req.body.ban);
    res.status(204).end();
  }catch(e){next(e);} });
adminRouter.patch("/users/:id/password",
  validateNumericId("id"),
  async (req,res,next)=>{ try{
    await adminSrv.resetPassword(+req.params.id, req.body.newPassword);
    res.status(204).end();
  }catch(e){next(e);} });

/* ---- PLAYLISTS ---- */
adminRouter.get(
  "/playlists",
  requireAuth,
  requireRole("admin"),
  async (req, res, next) => {
    try {
     const list = await adminSrv.getAllPlaylists(
       (req.query.sort ?? "date") as any,
       (req.query.dir  ?? "desc") as any
     );
      res.json(list);
    } catch (e) { next(e); }
  }
);

adminRouter.delete("/playlists/:id",
  validateNumericId("id"),
  async (req,res,next)=>{ try{
    await adminSrv.deletePlaylist(+req.params.id);
    res.status(204).end();
  }catch(e){next(e);} });
