// src/app.ts
import express from "express";
import path from "path";
import playlistRoutes from "./routes/playlist";

export const app = express();          // eksport

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use("/api", playlistRoutes);

// Jeśli serwujesz build front‑endu
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../../frontend/build")));
  app.get("*", (_req, res) =>
    res.sendFile(path.join(__dirname, "../../frontend/build/index.html"))
  );
}
