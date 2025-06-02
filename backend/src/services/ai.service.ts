import OpenAI from "openai";
import { z } from "zod";
import { MOOD_PROFILES } from "../ai/moodProfiles";
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

/* ---- 1) lista dozwolonych nastrojów ---- */
export const MOODS = [
  "happy",
  "in_love",
  "sad",
  "angry",
  "chill",
  "energetic",
  "nostalgic",
] as const;
export type Mood = typeof MOODS[number];
const RawSchema = z.object({
  mood: z.enum(MOODS),
});
export interface MoodParams {
  mood: Mood;
  valenceMin: number;
  valenceMax: number;
  energyMin: number;
  energyMax: number;
  genres: string[];
  tempoMin: number;
  tempoMax: number;
  keys: string[];
}


const systemPrompt = `
You are an assistant that classifies the user's text into ONE mood
from the following list:

${MOODS.join(", ")}

Return ONLY raw JSON: {"mood":"<one_of_the_list_above>"}
No other keys, no comments, no explanations.
`;

export async function analyseMood(text: string): Promise<MoodParams> {
  const resp = await openai.chat.completions.create({
    model: process.env.OPENAI_MODEL!, // np gpt-3.5-turbo-0125
    temperature: 0.0,
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user",   content: text.trim() },
    ],
    response_format: { type: "json_object" },
  });

  /** 1⃣ walidujemy JSON */
  const raw = RawSchema.parse(JSON.parse(resp.choices[0].message.content!));

  /** 2⃣ uzupełniamy z tabeli profili */
  const profile = MOOD_PROFILES[raw.mood];



  return {
    mood       : raw.mood,
    valenceMin : profile.valence[0],
    valenceMax : profile.valence[1],
    energyMin  : profile.energy[0],
    energyMax  : profile.energy[1],
    genres     : profile.genres,
    tempoMin   : profile.tempo[0],
    tempoMax   : profile.tempo[1],
    keys       : profile.keys,
  };
}
