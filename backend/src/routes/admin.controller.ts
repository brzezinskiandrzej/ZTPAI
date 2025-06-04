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
 *     summary: Returns **all** registered users
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
 *                 $ref: '#/components/schemas/User'
 *       401: { $ref: '#/components/responses/Unauthorized' }
 *       403: { $ref: '#/components/responses/Forbidden' }
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
 *     summary: Bans / un-bans a user
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
 *             required: [ban]
 *             properties:
 *               ban:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       200:
 *         description: Status changed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 userId:   { type: integer, example: 7 }
 *                 isBanned: { type: boolean, example: true }
 *       401: { $ref: '#/components/responses/Unauthorized' }
 *       403: { $ref: '#/components/responses/Forbidden' }
 *       404: { $ref: '#/components/responses/NotFound' }
 *       422: { $ref: '#/components/responses/Unprocessable' }
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
 *     summary: Resets a user password
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
 *               newPassword:
 *                 type: string
 *                 format: password
 *     responses:
 *       204: { description: Password reset — no content }
 *       401: { $ref: '#/components/responses/Unauthorized' }
 *       403: { $ref: '#/components/responses/Forbidden' }
 *       404: { $ref: '#/components/responses/NotFound' }
 *       422: { $ref: '#/components/responses/Unprocessable' }
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
 *     summary: Returns all playlists (sortable)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: sort
 *         schema: { type: string, enum: [date,name,songs] }
 *         description: Sort field
 *       - in: query
 *         name: dir
 *         schema: { type: string, enum: [asc,desc] }
 *         description: Sort direction
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
 *       403: { $ref: '#/components/responses/Forbidden' }
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
 *     summary: Deletes a playlist
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       204: { description: Deleted — no content }
 *       401: { $ref: '#/components/responses/Unauthorized' }
 *       403: { $ref: '#/components/responses/Forbidden' }
 *       404: { $ref: '#/components/responses/NotFound' }
 */
adminRouter.delete("/playlists/:id",
  validateNumericId("id"),
  async (req,res,next)=>{ try{
    await adminSrv.deletePlaylist(req.user!.userId,+req.params.id);
    res.status(204).end();
  }catch(e){next(e);} });
/**
 * @openapi
 * /admin/logs:
 *   get:
 *     tags: [Admin]
 *     summary: Returns admin event logs
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
 *                 type: object
 *       401: { $ref: '#/components/responses/Unauthorized' }
 *       403: { $ref: '#/components/responses/Forbidden' }
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

