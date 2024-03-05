import { container } from "tsyringe"
import { BadRequestError, FailedToCreateError } from "../../../entities/errors"
import { AddNewUserDeviceUseCase } from "../../userDevice/addNewUser/addNewUserDeviceUseCase"
import { DeviceRepository } from "../../../repositories/device.repository"
import { GenerateTokensUseCase } from "../../token/generateTokens/generateTokensUseCase"
import { AddAndDeleteRefreshToken } from "../../token/addAndDeleteRefreshToken/addAndDeleteRefreshTokenUseCase"
import { mockNoteEncryptionPublicKey } from "../../../__mock__/mockEncryption"

const mockAddNewUserDevice = jest.fn()
const mockGenerateRefreshToken = jest.fn()
const mockGenerateAccessToken = jest.fn()
const mockAddNewRefreshToken = jest.fn()

beforeEach(() => {
  jest.clearAllMocks()
  container.clearInstances()
  container.register<DeviceRepository>(DeviceRepository, {
    useValue: {
      addNewUserDevice: mockAddNewUserDevice,
    } as unknown as DeviceRepository,
  })

  container.register<GenerateTokensUseCase>(GenerateTokensUseCase, {
    useValue: {
      generateAccessToken: mockGenerateAccessToken,
      generateRefreshToken: mockGenerateRefreshToken,
    } as unknown as GenerateTokensUseCase,
  })

  container.register<AddAndDeleteRefreshToken>(AddAndDeleteRefreshToken, {
    useValue: {
      addNewRefreshToken: mockAddNewRefreshToken,
    } as unknown as AddAndDeleteRefreshToken,
  })
})

describe("AddNewUserDeviceUseCase", () => {
  it("should return BadRequestError if params is not valid", async () => {
    const addNewUserDeviceUseCase = container.resolve(AddNewUserDeviceUseCase)

    const result1 = await addNewUserDeviceUseCase.addUserDevice({} as any)
    expect(result1).toBeInstanceOf(BadRequestError)

    const result2 = await addNewUserDeviceUseCase.addUserDevice({
      deviceId: null,
    } as any)
    expect(result2).toBeInstanceOf(BadRequestError)

    const result3 = await addNewUserDeviceUseCase.addUserDevice({
      deviceId: 11,
    } as any)
    expect(result3).toBeInstanceOf(BadRequestError)

    const result4 = await addNewUserDeviceUseCase.addUserDevice({
      deviceId: "1",
      name: 2,
    } as any)
    expect(result4).toBeInstanceOf(BadRequestError)
  })
  it("should return FailedToCreateError if addNewUserDevice can't add user to databases", async () => {
    const addNewUserDeviceUseCase = container.resolve(AddNewUserDeviceUseCase)
    mockAddNewUserDevice.mockImplementation(() => null)

    const result = await addNewUserDeviceUseCase.addUserDevice({
      deviceId: "device_1",
      userId: 1,
      name: "Senya",
      type: "smartphone",
      operationSystem: "android",
      noteEncryptionPublicKey: mockNoteEncryptionPublicKey
    })
    expect(mockAddNewUserDevice).toHaveBeenCalledTimes(1)
    expect(result).toBeInstanceOf(FailedToCreateError)
  })

  it("should return FailedToCreateError if addNewRefreshToken can't add new refresh token to database ", async () => {
    const addNewUserDeviceUseCase = container.resolve(AddNewUserDeviceUseCase)
    mockAddNewUserDevice.mockImplementation(() => 1)
    mockGenerateAccessToken.mockImplementation(() => "accessToken")
    mockGenerateRefreshToken.mockImplementation(() => "refreshToken")
    mockAddNewRefreshToken.mockImplementation(() => new FailedToCreateError())

    const result = await addNewUserDeviceUseCase.addUserDevice({
      deviceId: "device_1",
      userId: 1,
      name: "Senya",
      type: "smartphone",
      operationSystem: "android",
      noteEncryptionPublicKey: mockNoteEncryptionPublicKey
    })

    expect(mockAddNewUserDevice).toHaveBeenCalledTimes(1)
    expect(mockGenerateAccessToken).toHaveBeenCalledTimes(1)
    expect(mockGenerateRefreshToken).toHaveBeenCalledTimes(1)
    expect(mockAddNewRefreshToken).toHaveBeenCalledTimes(1)
    expect(result).toBeInstanceOf(FailedToCreateError)
  })

  it("should return FailedToCreateError if addNewRefreshToken can't add new refresh token to database ", async () => {
    const addNewUserDeviceUseCase = container.resolve(AddNewUserDeviceUseCase)
    mockAddNewUserDevice.mockImplementation(() => 1)
    mockGenerateAccessToken.mockImplementation(() => "accessToken")
    mockGenerateRefreshToken.mockImplementation(() => "refreshToken")
    mockAddNewRefreshToken.mockImplementation(() => undefined)

    const result = await addNewUserDeviceUseCase.addUserDevice({
      deviceId: "device_1",
      userId: 1,
      name: "Senya",
      type: "smartphone",
      operationSystem: "android",
      noteEncryptionPublicKey: mockNoteEncryptionPublicKey
    })

    expect(mockAddNewUserDevice).toHaveBeenCalledTimes(1)
    expect(mockGenerateAccessToken).toHaveBeenCalledTimes(1)
    expect(mockGenerateRefreshToken).toHaveBeenCalledTimes(1)
    expect(mockAddNewRefreshToken).toHaveBeenCalledTimes(1)
    expect(result).toEqual({
      accessToken: "accessToken",
      refreshToken: "refreshToken",
    })
  })
})
