import { Router } from "express";
import { analyseMood, MOODS } from "../services/ai.service";
import { requireAuth } from "../middlewares/auth.middleware";
import { generatePlaylistForMood } from "../services/playlist.generator";
import { publishAdminEvent } from "../queues/publish";

export const aiRouter = Router();

/**
 * @openapi
 * /ai/mood:
 *   post:
 *     tags: [AI]
 *     summary: Analizuje tekst i zwraca wykryty nastrój + tworzy dopasowaną playlistę
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [text]
 *             properties:
 *               text:
 *                 type: string
 *                 minLength: 10
 *                 example: "I feel excited and full of energy today!"
 *     responses:
 *       201:
 *         description: OK — mood wykryty i playlist utworzona
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mood:        { type: string, example: "happy" }
 *                 confidence:  { type: number, format: float, example: 0.86 }
 *                 playlistId:  { type: integer, example: 12 }
 *                 userId:      { type: integer, example: 5 }
 *       400: { $ref: '#/components/responses/BadRequest' }
 *       401: { $ref: '#/components/responses/Unauthorized' }
 *       422: { $ref: '#/components/responses/Unprocessable' }
 */
aiRouter.post("/mood", requireAuth, async (req, res, next) => {
  try {
    const text: string = (req.body.text ?? "").trim();

    if (text.length < 10)
      return res.status(400).json({
        error: { code: "ai/too-short", message: "Describe your feelings in more detail." }
      });

    const moodData = await analyseMood(text);        
    await publishAdminEvent(
        req.user!.userId,         
        "AI_DETECTION",            
        null,                    
        { prompt: text.trim(), mood: moodData.mood }  
    );


    if (!MOODS.includes(moodData.mood as any))
      return res.status(422).json({
        error: { code: "ai/unsupported-mood", message: "Unsupported mood returned by AI" }
      });


    const playlistId = await generatePlaylistForMood(req.user!.userId, moodData);


    res.status(201).json({
      ...moodData,       
      playlistId,
      userId: req.user!.userId
    });

  } catch (err) { next(err); }
});
