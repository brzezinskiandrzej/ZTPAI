import { Router } from "express";
import { requireAuth }  from "../middlewares/auth.middleware";
import { requireRole }  from "../middlewares/role.middleware";
import { validateNumericId } from "../middlewares/validateId";
import * as adminSrv from "../services/admin.service";


export const adminRouter = Router();
adminRouter.use(requireAuth, requireRole("admin"));

/**
 * @openapi
 * /admin/users:
 *   get:
 *     tags: [Admin]
 *     summary: Lista wszystkich użytkowników
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items: { $ref: '#/components/schemas/User' }
 *       401: { $ref: '#/components/schemas/Error' }
 *       403: { $ref: '#/components/schemas/Error' }
 */
adminRouter.get(
  "/users",
  requireAuth,
  requireRole("admin"),
  async (_req, res, next) => {
    try { res.json(await adminSrv.listUsers()); }
    catch (e) { next(e); }
  }
);
/**
 * @openapi
 * /admin/users/{id}/ban:
 *   patch:
 *     tags: [Admin]
 *     summary: Blokuje lub odblokowuje użytkownika
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *       - in: query
 *         name: ban
 *         required: true
 *         schema: { type: boolean }
 *     responses:
 *       200:
 *         description: Zmieniono status
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 userId:   { type: integer }
 *                 isBanned: { type: boolean }
 *       401: { description: Brak autoryzacji }
 *       403: { description: Brak uprawnień }
 */
adminRouter.patch("/users/:id/ban",
  validateNumericId("id"),
  async (req,res,next)=>{ try{
    const targetId = +req.params.id;
    const ban = !!req.body.ban;
    await adminSrv.banUser(req.user!.userId, targetId, ban);
    res.json({ userId: targetId, isBanned: ban });
  }catch(e){next(e);} });
/**
 * @openapi
 * /admin/users/{id}/password:
 *   patch:
 *     tags: [Admin]
 *     summary: Resetuje hasło użytkownika
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [newPassword]
 *             properties:
 *               newPassword: { type: string, format: password }
 *     responses:
 *       204: { description: Zresetowano, brak treści }
 *       401: { $ref: '#/components/schemas/Error' }
 *       403: { $ref: '#/components/schemas/Error' }
 */
adminRouter.patch("/users/:id/password",
  validateNumericId("id"),
  async (req,res,next)=>{ try{
    await adminSrv.resetPassword(+req.params.id, req.body.newPassword);
    res.status(204).end();
  }catch(e){next(e);} });

/**
 * @openapi
 * /admin/playlists:
 *   get:
 *     tags: [Admin]
 *     summary: Lista wszystkich playlist
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: sort
 *         schema: { type: string, enum: [date,name,songs] }
 *         description: Pole sortowania
 *       - in: query
 *         name: dir
 *         schema: { type: string, enum: [asc,desc] }
 *         description: Kierunek sortowania
 *     responses:
 *       200:
 *         description: OK
 *       401: { $ref: '#/components/schemas/Error' }
 *       403: { $ref: '#/components/schemas/Error' }
 */
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
/**
 * @openapi
 * /admin/playlists/{id}:
 *   delete:
 *     tags: [Admin]
 *     summary: Usuwa playlistę
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       204: { description: Usunięto, brak treści }
 *       401: { $ref: '#/components/schemas/Error' }
 *       403: { $ref: '#/components/schemas/Error' }
 */
adminRouter.delete("/playlists/:id",
  validateNumericId("id"),
  async (req,res,next)=>{ try{
    await adminSrv.deletePlaylist(+req.params.id);
    res.status(204).end();
  }catch(e){next(e);} });
/**
 * @openapi
 * /admin/logs:
 *   get:
 *     tags: [Admin]
 *     summary: Pobiera logi zdarzeń administracyjnych
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: OK
 *       401: { $ref: '#/components/schemas/Error' }
 *       403: { $ref: '#/components/schemas/Error' }
 */
adminRouter.get(
  "/logs",
  requireAuth,
  requireRole("admin"),
  async (_req, res, next) => {
    try {
      const logs = await adminSrv.listLogs();   
      res.json(logs);
    } catch (e) { next(e); }
  }
);

