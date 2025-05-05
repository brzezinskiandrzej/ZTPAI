import { AppDataSource } from "../src/database/config/data-source";

// 1) Uruchom DB przed wszystkimi testami
beforeAll(async () => {
  await AppDataSource.initialize();
});

// 2) Czyść dane po każdym teście (opcjonalnie)
afterEach(async () => {
  const entities = AppDataSource.entityMetadatas;
  for (const { tableName } of entities) {
    await AppDataSource.query(`TRUNCATE TABLE "${tableName}" CASCADE;`);
  }
});

// 3) Zamknij połączenie po zakończeniu
afterAll(async () => {
  await AppDataSource.destroy();
});
