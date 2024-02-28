import { migrateFrom0To1 } from "./migration_0-1"

export const runMigrations = async () => {
  try {
    await migrateFrom0To1()
  } catch (e) {
    console.log(e)
  }
}
