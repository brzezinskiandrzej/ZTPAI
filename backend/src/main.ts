// import express from "express";
// import path from "path";
// import { playlistRouter } from "./routes/playlist.controller";
// import { AppDataSource } from "./database/config/data-source";

// const app = express();
// const PORT = process.env.PORT || 3000;
// AppDataSource.initialize()
//   .then(() => {
//     const PORT = process.env.PORT || 5000;
//     app.listen(PORT, () => {
//     });
//   })
//   .catch(err => {
//   });
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));


// app.use("/api", playlistRouter);


// //if (process.env.NODE_ENV === "production") {
// app.use(express.static(path.join(__dirname, "../../frontend/build")));

// app.get("*", (req, res) => {
//   res.sendFile(path.join(__dirname, "../../frontend/build/index.html"));
// });

// app.listen(PORT, () => {
// });


  
// export default app;
