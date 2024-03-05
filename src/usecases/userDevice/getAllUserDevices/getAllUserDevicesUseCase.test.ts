import { container } from "tsyringe"
import { GetAllUserDevicesUseCase } from "./getAllUserDevicesUseCase"
import { DeviceRepository } from "../../../repositories/device.repository"
import { UnexpectedError } from "../../../entities/errors"
import {
  DeviceOperationSystem,
  DeviceTypes,
  UserDevice,
  UserDeviceResponse,
} from "../../../entities/userDevice"
import { mockNoteEncryptionPublicKey } from "../../../__mock__/mockEncryption"

const mockGetAllUserDevices = jest.fn()

beforeEach(() => {
  jest.clearAllMocks()
  container.clearInstances()
  container.register<DeviceRepository>(DeviceRepository, {
    useValue: {
      getAllUserDevices: mockGetAllUserDevices,
    } as unknown as DeviceRepository,
  })
})

describe("getAllUserDevicesUseCase", () => {
  it("should return error if DB return null", async () => {
    const getAllUserDevicesUseCase = container.resolve(GetAllUserDevicesUseCase)
    mockGetAllUserDevices.mockImplementation(() => null)

    const result = await getAllUserDevicesUseCase.getAllUserDevices(1)

    expect(result).toBeInstanceOf(UnexpectedError)
  })

  it("should return empty e", async () => {
    const getAllUserDevicesUseCase = container.resolve(GetAllUserDevicesUseCase)
    mockGetAllUserDevices.mockImplementation(() => [
      new UserDevice({
        deviceId: "1",
        userId: 1,
        name: undefined,
        type: undefined,
        operationSystem: DeviceOperationSystem.android,
        noteEncryptionPublicKey: mockNoteEncryptionPublicKey,
      }),
    ])

    const result = (await getAllUserDevicesUseCase.getAllUserDevices(
      1
    )) as UserDeviceResponse[]

    expect(result.length).toBe(1)
    expect(result[0]).toEqual({
      deviceId: "1",
      userId: 1,
      name: null,
      type: null,
      operationSystem: DeviceOperationSystem.android,
      noteEncryptionPublicKey: mockNoteEncryptionPublicKey,
    })
  })
})
