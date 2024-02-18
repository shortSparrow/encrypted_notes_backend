import { injectable } from "tsyringe"
import { query } from "../utils/db/query"
import { UserDevice } from "../entities/userDevice"

type AddNewUserDeviceProps = {
  deviceId: string
  userId: number
  name?: string
  type?: string
  operationSystem?: string
}

type AddRefreshTokenToDeviceProps = {
  userId: number
  deviceId: string
  refreshToken: string
}

type GetDeviceByDeviceIdProps = {
  deviceId: string
  userId: number
}

@injectable()
export class DeviceRepository {
  addNewUserDevice = async (
    props: AddNewUserDeviceProps
  ): Promise<number | null> => {
    try {
      const { deviceId, userId, name, type, operationSystem } = props
      const result = await query(
        "INSERT INTO devices (device_id, user_id, name, type, operation_system) VALUES($1, $2, $3, $4, $5) RETURNING id",
        [deviceId, userId, name, type, operationSystem]
      )

      return result.rows[0]?.id ?? null
    } catch (err) {
      console.log("err: ", err)
      return null
    }
  }

  getDeviceByDeviceId = async ({
    deviceId,
    userId,
  }: GetDeviceByDeviceIdProps): Promise<UserDevice | null> => {
    try {
      const result = await query(
        "SELECT * FROM devices WHERE device_id = $1 AND user_id = $2",
        [deviceId, userId]
      )

      if (!result.rows[0]) return null

      const { name, type, operation_system: operationSystem } = result.rows[0]

      return new UserDevice({ deviceId, userId, name, type, operationSystem })
    } catch (err) {
      // TODO handler error
      return null
    }
  }

  addRefreshTokenToDevice = async (
    props: AddRefreshTokenToDeviceProps
  ): Promise<number | null> => {
    try {
      const { userId, deviceId, refreshToken } = props
      const result = await query(
        "INSERT INTO device_refresh_tokens (user_id, device_id, token) VALUES($1, $2, $3) RETURNING id",
        [userId, deviceId, refreshToken]
      )

      return result.rows[0]?.id ?? null
    } catch (err) {
      console.log("err: ", err)
      return null
    }
  }
}
