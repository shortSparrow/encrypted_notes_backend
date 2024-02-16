import { QueryConfig } from "pg"
import { dbClient } from "../../database/database"

export const query = (
  text: string | QueryConfig<any[]>,
  params?: any[] | undefined
) => {
  return dbClient.query(text, params)
}
