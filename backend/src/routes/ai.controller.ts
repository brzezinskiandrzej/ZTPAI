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

    /* -------- 1) analiza nastroju -------- */
    const moodData = await analyseMood(text);          // { mood, valence, energy, … }
    await publishAdminEvent(
        req.user!.userId,          // actor
        "AI_DETECTION",            // action
        null,                      // targetId – brak
        { prompt: text.trim(), mood: moodData.mood }   // meta
    );

    /* -------- 2) walidacja nastroju -------- */
    if (!MOODS.includes(moodData.mood as any))
      return res.status(422).json({
        error: { code: "ai/unsupported-mood", message: "Unsupported mood returned by AI" }
      });

    /* -------- 3) tworzymy (lub pobieramy) playlistę -------- */
    const playlistId = await generatePlaylistForMood(req.user!.userId, moodData);

    /* -------- 4) finalna odpowiedź -------- */
    res.status(201).json({
      ...moodData,             // ← rozpakowujemy, dzięki czemu `mood` jest w top-level
      playlistId,
      userId: req.user!.userId
    });

  } catch (err) { next(err); }
});
