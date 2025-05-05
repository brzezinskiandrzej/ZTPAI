// src/server.ts
import { app } from "./app";
import { AppDataSource } from "./database/config/data-source";

(async () => {
  await AppDataSource.initialize();
  console.log("Data Source initialized!");
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
})();
