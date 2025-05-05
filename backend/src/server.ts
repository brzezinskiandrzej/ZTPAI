import { AppDataSource } from "./database/config/data-source";
import { app } from "./app";

(async () => {
  await AppDataSource.initialize();
  app.set("dataSource", AppDataSource);          // dla testów
  const PORT = process.env.PORT ?? 3000;
  app.listen(PORT, () => console.log(`Server @${PORT}`));
})();