import { Client } from "pg"
import { databaseConfig, databaseTestConfig } from "../config/database.config"
import { runMigrations } from "./migrations"

export const realDbClient = new Client(databaseConfig)
export const dbTestClient = new Client(databaseTestConfig)

const isTest = true
export const dbClient = isTest ? dbTestClient : realDbClient

export const initDb = async () => {
  try {
    console.log('before connect')
    await dbClient.connect()
    console.log('before runMigrations')
    await runMigrations()
    const justRandomQuery = await dbClient.query("SELECT * FROM users WHERE phone = $1", [
      '+39',
    ])
    console.log("Connected to DB successfully: ", dbClient.database)
  } catch (err) {
    console.log("Failed to connect to DB: ", err)
  }
}

