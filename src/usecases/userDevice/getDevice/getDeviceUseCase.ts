import { injectable } from "tsyringe"
import { DeviceRepository } from "../../../repositories/device.repository"

@injectable()
export class GetDeviceUseCase {
  constructor(private _deviceRepository: DeviceRepository) {}

  getDeviceById = async (deviceId: string) => {
    try {
      const device = await this._deviceRepository.getDeviceByDeviceId(deviceId)
      return device
    } catch (err) {
      // TODO log error
      return null
    }
  }
}
