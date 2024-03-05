import { UserDevice, UserDeviceResponse } from "../userDevice"

class UserDeviceMapper {
  deviceToResponseDevice = (userDevice: UserDevice): UserDeviceResponse => ({
    deviceId: userDevice.deviceId,
    userId: userDevice.userId,
    name: userDevice.name ?? null,
    type: userDevice.type ?? null,
    operationSystem: userDevice.operationSystem ?? null,
    noteEncryptionPublicKey: userDevice.noteEncryptionPublicKey,
  })
}

export const userDeviceMapper = new UserDeviceMapper()
