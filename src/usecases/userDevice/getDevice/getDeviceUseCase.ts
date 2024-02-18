import { injectable } from "tsyringe"
import { DeviceRepository } from "../../../repositories/device.repository"
import { UserDeviceId } from "../../../.."

@injectable()
export class GetDeviceUseCase {
  constructor(private _deviceRepository: DeviceRepository) {}

  getDeviceById = async ({ userId, deviceId }: UserDeviceId) => {
    try {
      const device = await this._deviceRepository.getDeviceByDeviceId({
        deviceId,
        userId,
      })
      return device
    } catch (err) {
      // TODO log error
      return null
    }
  }
}
