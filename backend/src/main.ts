import express from "express";
import path from "path";
import playlistRoutes from "./routes/playlist";

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use("/api", playlistRoutes);


//if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../../frontend/build")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../../frontend/build/index.html"));
  });

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;
