import { injectable } from "tsyringe"
import { query } from "../utils/db/query"
import { UserDeviceId } from "../.."
import { TableNames } from "../database/constants"

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
        `INSERT into ${TableNames.DEVICE_REFRESH_TOKENS} (device_id, user_id, token) VALUES($1,$2,$3) RETURNING id`,
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
        `SELECT token FROM ${TableNames.DEVICE_REFRESH_TOKENS} WHERE token = $1 LIMIT 1`,
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
        `DELETE FROM ${TableNames.DEVICE_REFRESH_TOKENS} WHERE user_id = $1 AND device_id = $2`,
        [userId, deviceId]
      )

      return true
    } catch (err) {
      console.log("Error: ", err)
      return false
    }
  }

  removeDeviceRefreshToken = async (
    userId: number,
    deviceId: string
  ): Promise<boolean> => {
    try {
      await query(
        `DELETE FROM ${TableNames.DEVICE_REFRESH_TOKENS} WHERE user_id = $1 AND device_id = $2`,
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
        `SELECT * FROM ${TableNames.DEVICE_REFRESH_TOKENS} WHERE user_id = $1 AND device_id = $2`,
        [userId, deviceId]
      )

      return result.rows[0]?.token ?? null
    } catch (err) {
      console.log("Error: ", err)
      return null
    }
  }
}
