import { container } from "tsyringe"
import { DeviceRepository } from "../../../repositories/device.repository"
import { LogoutUseCase } from "./logoutUseCase"
import { RefreshTokenRepository } from "../../../repositories/token.repository"
import * as queryUtils from "../../../utils/db/query"
import { UnexpectedError } from "../../../entities/errors"

const mockRemoveDevice = jest.fn()
const mockRemoveDeviceRefreshToken = jest.fn()

jest.spyOn(queryUtils, "query").mockImplementation(jest.fn())

beforeEach(() => {
  jest.clearAllMocks()
  container.clearInstances()
  container.register<DeviceRepository>(DeviceRepository, {
    useValue: {
      removeDevice: mockRemoveDevice,
    } as unknown as DeviceRepository,
  })
  container.register<RefreshTokenRepository>(RefreshTokenRepository, {
    useValue: {
      removeDeviceRefreshToken: mockRemoveDeviceRefreshToken,
    } as unknown as RefreshTokenRepository,
  })
})

describe("logoutUseCase", () => {
  it("should return false if removing device failed", async () => {
    const logoutUseCase = container.resolve(LogoutUseCase)
    mockRemoveDevice.mockImplementation(() => null)

    const result = await logoutUseCase.logout(1, "device_id_1")

    expect(result).toBe(false)
  })
  it("should return false if removing device refresh token failed", async () => {
    const logoutUseCase = container.resolve(LogoutUseCase)
    mockRemoveDeviceRefreshToken.mockImplementation(() => false)

    const result = await logoutUseCase.logout(1, "device_id_1")

    expect(result).toBe(false)
  })

  it("should return true if removing device refresh token and removing device completed successfully", async () => {
    const logoutUseCase = container.resolve(LogoutUseCase)
    mockRemoveDevice.mockImplementation(() => 11)
    mockRemoveDeviceRefreshToken.mockImplementation(() => true)

    const result = await logoutUseCase.logout(1, "device_id_1")

    expect(result).toBe(true)
  })

  it("should return UnexpectedError if some error happened", async () => {
    const logoutUseCase = container.resolve(LogoutUseCase)
    mockRemoveDevice.mockImplementation(() => {
      throw new Error("XXX")
    })
    mockRemoveDeviceRefreshToken.mockImplementation(() => true)

    const result = await logoutUseCase.logout(1, "device_id_1")
    expect(result).toBeInstanceOf(UnexpectedError)
  })
})
