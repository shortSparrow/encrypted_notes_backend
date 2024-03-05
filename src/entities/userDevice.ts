import { JWK } from "./jwk"

// * DeviceOperationSystem for browsers will be bull
export enum DeviceOperationSystem {
  android = "android",
  ios = "ios",
  linux = "linux",
  windows = "windows",
  macOS = "macOS",
}

export enum DeviceTypes {
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
  noteEncryptionPublicKey: JWK
}

export class UserDevice {
  deviceId: string
  userId: number
  name?: string
  type?: DeviceTypes
  operationSystem?: DeviceOperationSystem
  noteEncryptionPublicKey: JWK

  constructor({
    deviceId,
    userId,
    name,
    type,
    operationSystem,
    noteEncryptionPublicKey,
  }: Props) {
    this.deviceId = deviceId
    this.userId = userId
    this.name = name
    this.type = type
    this.operationSystem = operationSystem
    this.noteEncryptionPublicKey = noteEncryptionPublicKey
  }
}


export type UserDeviceResponse = {
  deviceId: string
  userId: number
  name: string | null
  type: DeviceTypes | null
  operationSystem: DeviceOperationSystem | null
  noteEncryptionPublicKey: JWK
}