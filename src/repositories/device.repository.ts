import { injectable } from "tsyringe"
import { query } from "../utils/db/query"
import { UserDevice } from "../entities/userDevice"
import { TableNames } from "../database/constants"

type AddNewUserDeviceProps = {
  deviceId: string
  userId: number
  name?: string
  type?: string
  operationSystem?: string
  noteEncryptionPublicKey: string
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
      const {
        deviceId,
        userId,
        noteEncryptionPublicKey,
        name,
        type,
        operationSystem,
      } = props
      const result = await query(
        `INSERT INTO ${TableNames.DEVICES} (device_id, user_id, public_key_for_notes_encryption, name, type, operation_system) VALUES($1, $2, $3, $4, $5, $6) RETURNING id`,
        [deviceId, userId, noteEncryptionPublicKey, name, type, operationSystem]
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
        `SELECT * FROM ${TableNames.DEVICES} WHERE device_id = $1 AND user_id = $2`,
        [deviceId, userId]
      )

      if (!result.rows[0]) return null

      const {
        name,
        type,
        operation_system: operationSystem,
        public_key_for_notes_encryption: noteEncryptionPublicKey,
      } = result.rows[0]

      return new UserDevice({
        deviceId,
        userId,
        name,
        type,
        operationSystem,
        noteEncryptionPublicKey,
      })
    } catch (err) {
      // TODO handler error
      return null
    }
  }

  getAllUserDevices = async (userId: number): Promise<UserDevice[] | null> => {
    try {
      const result = await query(
        `SELECT * FROM ${TableNames.DEVICES} WHERE user_id = $1`,
        [userId]
      )

      if (!result.rows.length) return null

      return result.rows.map(
        (item) =>
          new UserDevice({
            deviceId: item.device_id,
            userId,
            name: item.name,
            type: item.type,
            operationSystem: item.operationSystem,
            noteEncryptionPublicKey: item.public_key_for_notes_encryption,
          })
      )
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
        `INSERT INTO ${TableNames.DEVICE_REFRESH_TOKENS} (user_id, device_id, token) VALUES($1, $2, $3) RETURNING id`,
        [userId, deviceId, refreshToken]
      )

      return result.rows[0]?.id ?? null
    } catch (err) {
      console.log("err: ", err)
      return null
    }
  }

  removeDevice = async (
    userId: number,
    deviceId: string
  ): Promise<null | number> => {
    try {
      const result = await query(
        `DELETE FROM ${TableNames.DEVICES} WHERE user_id=$1 AND device_id=$2 RETURNING id`,
        [userId, deviceId]
      )

      return result.rows[0]?.id ?? null
    } catch (err) {
      console.log("err: ", err)
      return null
    }
  }
}
