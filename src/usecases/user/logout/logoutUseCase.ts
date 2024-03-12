import { injectable } from "tsyringe"
import { UnexpectedError } from "../../../entities/errors"

import { LogoutResponse } from "./logoutUseCase.types"
import { DeviceRepository } from "../../../repositories/device.repository"
import { RefreshTokenRepository } from "../../../repositories/token.repository"
import { query } from "../../../utils/db/query"

@injectable()
export class LogoutUseCase {
  constructor(
    private _deviceRepository: DeviceRepository,
    private _refreshTokenRepository: RefreshTokenRepository
  ) {}

  logout = async (userId: number, deviceId: string): LogoutResponse => {
    try {
      // FIXME potential problems access token for deleted user still valid
      const isSuccess = await this._deleteDeviceAndCleanAllData(
        userId,
        deviceId
      )
      return isSuccess
    } catch (err) {
      console.log("Error: ", err)
      return new UnexpectedError(`Unknown error: ${err}`)
    }
  }

  private _deleteDeviceAndCleanAllData = async (
    userId: number,
    deviceId: string
  ): Promise<boolean> => {
    try {
      await query("BEGIN")
      // remove device and all related notes
      const removeDeviceResult = await this._deviceRepository.removeDevice(
        userId,
        deviceId
      )
      const removeRefreshTokenResult =
        await this._refreshTokenRepository.removeDeviceRefreshToken(
          userId,
          deviceId
        )

      if (removeDeviceResult === null || removeRefreshTokenResult === false) {
        await query("ROLLBACK")
        return false
      }
      await query("COMMIT")

      return true
    } catch (e) {
      await query("ROLLBACK")
      throw e
    }
  }
}
