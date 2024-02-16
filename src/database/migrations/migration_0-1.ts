import { dbClient } from "../database"

export const migrateFrom0To1 = async () => {
  // await dbClient.query(
  //   "DROP TABLE devices, users, device_refresh_tokens;",
  //   []
  // )

  await dbClient.query(
    "CREATE TABLE IF NOT EXISTS users (id SERIAL PRIMARY KEY, phone TEXT, email TEXT, password_hashed TEXT NOT NULL, UNIQUE(phone), UNIQUE(email));",
    []
  )

  await dbClient.query(
    "CREATE TABLE IF NOT EXISTS devices (id SERIAL PRIMARY KEY, user_id SERIAL NOT NULL, device_id TEXT NOT NULL, name TEXT, type TEXT, operation_system TEXT);"
  )

  // TODO maybe rename device_id to device_global_id. Щоб не плутати його з полем id у табличці devices
  await dbClient.query(
    "CREATE TABLE IF NOT EXISTS device_refresh_tokens (id SERIAL PRIMARY KEY, user_id SERIAL NOT NULL, device_id TEXT NOT NULL, token TEXT NOT NULL);"
  )
}
