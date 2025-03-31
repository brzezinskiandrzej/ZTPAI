
import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "../../backend/src/models/User";



export const AppDataSource = new DataSource({
  type: "postgres",
  url: process.env.DATABASE_URL || "postgres://user:password@localhost:5432/mydatabase",
  entities: [User],
  migrations: ["../database/migrations/*.ts"],
  synchronize: true
});


