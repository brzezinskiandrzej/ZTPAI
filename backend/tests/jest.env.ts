// tests/jest.env.ts  ────────────────
import path from "path";
import dotenv from "dotenv";

/* Wczytujemy _wyłącznie_ plik .env.test  */
dotenv.config({ path: path.resolve(__dirname, "../.env.test") });

/*  Gdyby coś nie było w pliku – dajemy wartości domyślne   */
process.env.ACCESS_TOKEN_SECRET  ??= "test-access-secret";
process.env.REFRESH_TOKEN_SECRET ??= "test-refresh-secret";
process.env.TEST_JWT_SECRET      ??= process.env.ACCESS_TOKEN_SECRET;
