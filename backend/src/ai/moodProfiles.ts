export interface MoodProfile {
  valence:    [number, number];   // min-max
  energy:     [number, number];
  tempo:      [number, number];
  genres:     string[];
  keys:       string[];
}

export const MOOD_PROFILES: Record<
  "happy" | "sad" | "angry" | "chill" | "in_love" | "energetic" | "nostalgic",
  MoodProfile
> = {
    happy: { valence: [0.7, 1], energy: [0.6, 1], tempo: [110, 150], genres: ["pop", "dance"], keys: ["C", "G", "D"] },
    sad: { valence: [0, 0.4], energy: [0, 0.5], tempo: [60, 90], genres: [ "lofi","ballad", "acoustic"], keys: ["Am", "Em", "Dm"] },
    angry: { valence: [0, 0.3], energy: [0.7, 1], tempo: [130, 180], genres: ["metal", "hard-rock"], keys: ["E", "F#m"] },
    chill: { valence: [0.5, 0.8], energy: [0.2, 0.6], tempo: [70, 110], genres: ["lofi", "chill"], keys: ["F", "Bb", "Eb"] },
    in_love: { valence: [0.6, 1], energy: [0.4, 0.8], tempo: [90, 140], genres: ["pop", "dance"], keys: ["C#", "D#"] },
    energetic: {valence: [0.5, 1], energy:  [0.8, 1], tempo:   [120, 180], genres:  ["edm", "electro", "rock"], keys:    ["E", "B", "F#"],},
    nostalgic: {valence: [0.3, 0.7], energy:  [0.2, 0.6], tempo:   [60, 110], genres:  ["retro", "soul", "oldies"], keys:    ["C", "F", "Gm"],},
};
