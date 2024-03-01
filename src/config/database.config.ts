import { ClientConfig } from "pg"
import { config } from "dotenv"

config()

export const databaseConfig: ClientConfig =
  process.env.NODE_ENV === "test" // Jest automatically defines environment variable NODE_ENV as test
    ? {
        host: process.env.DB_HOST,
        port: 5435,
        user: "user123test",
        password: "password123test",
        database: "database123test",
      }
    : {
        host: process.env.DB_HOST,
        port: Number(process.env.DB_PORT),
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
      }
