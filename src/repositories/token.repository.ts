import { injectable } from "tsyringe"
import { query } from "../utils/db/query"

type AddNewRefreshTokenProps = {
  refreshToken: string
  userId: number
  deviceId: string
}

@injectable()
export class TokenRepository {
  constructor() {}

  addNewRefreshToken = async (props: AddNewRefreshTokenProps): Promise<number | null> => {
    try {
      const { refreshToken, userId, deviceId } = props
      const result = await query(
        "INSERT into device_refresh_tokens (device_id, user_id, token) VALUES($1,$2,$3) RETURNING id",
        [deviceId, userId, refreshToken]
      )
      return result.rows[0]?.id ?? null
    } catch (err) {
      console.log("Error: ", err)
      return null
    }
  }
}
