
import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "../../backend/src/models/User";
import { Song } from "../../backend/src/models/Song";



export const AppDataSource = new DataSource({
  type: "postgres",
  url: process.env.DATABASE_URL || "postgres://user:password@localhost:5432/mydatabase",
  entities: [User,Song],
  migrations: ["../database/migrations/*.ts"],
  synchronize: true
});


