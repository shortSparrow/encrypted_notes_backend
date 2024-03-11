import { injectable } from "tsyringe"
import { DeviceRepository } from "../../../repositories/device.repository"
import { GetAllUserDevicesResponse } from "./getAllUserDevicesUseCase.types"
import { UnexpectedError } from "../../../entities/errors"
import { userDeviceMapper } from "../../../entities/mappers/userDevice"

@injectable()
export class GetAllUserDevicesUseCase {
  constructor(private _deviceRepository: DeviceRepository) {}

  getAllUserDevices = async (
    userId: number
  ): Promise<GetAllUserDevicesResponse> => {
    try {
      const devices = await this._deviceRepository.getAllUserDevices(userId)

      if (devices === null) {
        return new UnexpectedError()
      }

      return devices.map((deviceItem) =>
        userDeviceMapper.deviceToResponseDevice(deviceItem)
      )
    } catch (err) {
      return new UnexpectedError()
    }
  }
}
