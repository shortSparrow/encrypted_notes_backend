import { TableNames } from "../constants"
import { dbClient } from "../database"

export const migrateFrom0To1 = async () => {
  // await dbClient.query(
  //   `DROP TABLE ${TableNames.DEVICES}, ${TableNames.USERS}, ${TableNames.DEVICE_REFRESH_TOKENS}, ${TableNames.NOTES};`,
  //   []
  // )

  await dbClient.query(
    `CREATE TABLE IF NOT EXISTS ${TableNames.USERS} (id SERIAL PRIMARY KEY, phone TEXT, email TEXT, password_hashed TEXT NOT NULL, UNIQUE(phone), UNIQUE(email));`,
    []
  )

  await dbClient.query(
    `CREATE TABLE IF NOT EXISTS ${TableNames.DEVICES} (id SERIAL PRIMARY KEY, user_id SERIAL NOT NULL, public_key_for_notes_encryption TEXT NOT NULL, device_id TEXT NOT NULL, name TEXT, type TEXT, operation_system TEXT);`
  )

  // TODO maybe rename device_id to device_global_id. Щоб не плутати його з полем id у табличці devices
  await dbClient.query(
    `CREATE TABLE IF NOT EXISTS ${TableNames.DEVICE_REFRESH_TOKENS} (id SERIAL PRIMARY KEY, user_id SERIAL NOT NULL, device_id TEXT NOT NULL, token TEXT NOT NULL);`
  )

  await dbClient.query(
    `CREATE TABLE IF NOT EXISTS ${TableNames.NOTES} (id SERIAL PRIMARY KEY, encrypted_title TEXT, encrypted_message TEXT NOT NULL, created_at TEXT NOT NULL, updated_at TEXT NOT NULL, send_to_device_id TEXT NOT NULL, note_global_id TEXT NOT NULL, user_id SERIAL NOT NULL);`
  )
}
