import express from "express";
import path from "path";
import playlistRoutes from "./routes/playlist.controller";
import { AppDataSource } from "./database/config/data-source";

const app = express();
const PORT = process.env.PORT || 3000;
AppDataSource.initialize()
  .then(() => {
    console.log("Data Source initialized!");
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error("Error during Data Source initialization:", err);
  });
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
