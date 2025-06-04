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
 *     summary: Zwraca analizę nastroju
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties: { text: { type: string } }
 *     responses:
 *       200: { description: OK }
 *       400: { description: Brak tekstu / zbyt krótki opis }
 *       422: { description: Niewłaściwy mood }
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
