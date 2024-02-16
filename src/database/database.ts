import { Client } from "pg"
import { databaseConfig } from "../config/database.config"
import { runMigrations } from "./migrations"

export const dbClient = new Client(databaseConfig)

export const initDb = async () => {
  try {
    await dbClient.connect()
    await runMigrations()

    console.log("Connected to DB successfully")
  } catch (err) {
    console.log("Failed to connect to DB: ", err)
  }
}
