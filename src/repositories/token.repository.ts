import { injectable } from "tsyringe"
import { query } from "../utils/db/query"
import { UserDeviceId } from "../.."

type AddNewRefreshTokenProps = {
  refreshToken: string
  userId: number
  deviceId: string
}

@injectable()
export class RefreshTokenRepository {
  constructor() {}

  addNewRefreshToken = async (
    props: AddNewRefreshTokenProps
  ): Promise<number | null> => {
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

  getTokenByValue = async (refreshToken: string): Promise<string | null> => {
    try {
      const result = await query(
        "SELECT token FROM device_refresh_tokens WHERE token = $1 LIMIT 1",
        [refreshToken]
      )

      return result.rows[0]?.token ?? null
    } catch (err) {
      console.log("Error: ", err)
      return null
    }
  }

  resetAllRefreshTokensForDevice = async ({
    userId,
    deviceId,
  }: UserDeviceId): Promise<boolean> => {
    try {
      await query(
        "DELETE FROM device_refresh_tokens WHERE user_id = $1 AND device_id = $2",
        [userId, deviceId]
      )

      return true
    } catch (err) {
      console.log("Error: ", err)
      return false
    }
  }

  // TODO not uses now
  getTokenByUserId = async ({
    userId,
    deviceId,
  }: UserDeviceId): Promise<string | null> => {
    try {
      const result = await query(
        "SELECT * FROM device_refresh_tokens WHERE user_id = $1 AND device_id = $2",
        [userId, deviceId]
      )

      return result.rows[0]?.token ?? null
    } catch (err) {
      console.log("Error: ", err)
      return null
    }
  }
}
