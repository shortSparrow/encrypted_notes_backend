// * DeviceOperationSystem for browsers will be bull
enum DeviceOperationSystem {
  android = "android",
  ios = "ios",
  linux = "linux",
  windows = "windows",
  macOS = "macOS",
}

enum DeviceTypes {
  smartphone = "smartphone",
  tablet = "tablet",
  laptop = "laptop",
  browser = "browser",
}

type Props = {
  userId: number
  deviceId: string
  name?: string
  type?: DeviceTypes
  operationSystem?: DeviceOperationSystem
}

export class UserDevice {
  deviceId: string
  userId: number
  name?: string
  type?: DeviceTypes
  operationSystem?: DeviceOperationSystem

  constructor({ deviceId, userId, name, type, operationSystem }: Props) {
    this.deviceId = deviceId
    this.userId = userId
    this.name = name
    this.type = type
    this.operationSystem = operationSystem
  }
}
