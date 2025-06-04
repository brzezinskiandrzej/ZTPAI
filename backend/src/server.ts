import { AppDataSource } from "./database/config/data-source";
import { app } from "./app";
import { initQueues } from "./queues";
import { startAdminConsumer }   from "./queues/admin.events.consumer";
(async () => {
  await AppDataSource.initialize();
  app.set("dataSource", AppDataSource);      
  const PORT = process.env.PORT ?? 3000;
  app.listen(PORT);
  await initQueues();
  startAdminConsumer(); 
})();