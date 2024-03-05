import { container } from "tsyringe"
import jwt from "jsonwebtoken"
import { GetNewAccessTokenUseCase } from "./getNewAccessTokenUseCase"
import { GenerateTokensUseCase } from "../generateTokens/generateTokensUseCase"
import { tokenConfig } from "../../../config/token.config"
import {
  BadRequestError,
  FailedToCreateError,
  NotFoundError,
  UnauthorizedError,
} from "../../../entities/errors"
import { UserRepository } from "../../../repositories/user.repository"
import { DeviceRepository } from "../../../repositories/device.repository"
import { User } from "../../../entities/user"
import { UserDevice } from "../../../entities/userDevice"
import { RefreshTokenRepository } from "../../../repositories/token.repository"
import { AddAndDeleteRefreshToken } from "../addAndDeleteRefreshToken/addAndDeleteRefreshTokenUseCase"
import { mockNoteEncryptionPublicKey } from "../../../__mock__/mockEncryption"

const mockUser = new User({ id: 1, phone: "1111", passwordHashed: "password" })
const mockUserDevice = new UserDevice({
  userId: 1,
  deviceId: "1",
  noteEncryptionPublicKey: mockNoteEncryptionPublicKey,
})

const mockGetUserById = jest.fn()
const mockGtDeviceByDeviceId = jest.fn()
const mockGetTokenByValue = jest.fn()
const mockResetAllRefreshTokensForDevice = jest.fn()
const mockGenerateRefreshToken = jest.fn()
const mockGenerateAccessToken = jest.fn()
const mockAddNewRefreshToken = jest.fn()
const mockResetAllRefreshTokensForDeviceUseCase = jest.fn()

jest.mock("jsonwebtoken", () => ({
  ...jest.requireActual("jsonwebtoken"),
}))

beforeEach(() => {
  jest.clearAllMocks()
  container.clearInstances()
  container.register<UserRepository>(UserRepository, {
    useValue: {
      getUserById: mockGetUserById,
    } as unknown as UserRepository,
  })

  container.register<DeviceRepository>(DeviceRepository, {
    useValue: {
      getDeviceByDeviceId: mockGtDeviceByDeviceId,
    } as unknown as DeviceRepository,
  })

  container.register<RefreshTokenRepository>(RefreshTokenRepository, {
    useValue: {
      getTokenByValue: mockGetTokenByValue,
      resetAllRefreshTokensForDevice: mockResetAllRefreshTokensForDevice,
    } as unknown as RefreshTokenRepository,
  })

  container.register<GenerateTokensUseCase>(GenerateTokensUseCase, {
    useValue: {
      generateRefreshToken: mockGenerateRefreshToken,
      generateAccessToken: mockGenerateAccessToken,
    } as unknown as GenerateTokensUseCase,
  })

  container.register<AddAndDeleteRefreshToken>(AddAndDeleteRefreshToken, {
    useValue: {
      resetAllRefreshTokensForDevice: mockResetAllRefreshTokensForDeviceUseCase,
      addNewRefreshToken: mockAddNewRefreshToken,
    } as unknown as AddAndDeleteRefreshToken,
  })
})
describe("GetNewAccessTokenUseCase", () => {
  it("should return UnauthorizedError if refresh token is expired", async () => {
    const getNewAccessTokenUseCase = container.resolve(GetNewAccessTokenUseCase)
    const expiredRefreshToken = jwt.sign(
      { userId: 1, deviceId: "device_1" },
      tokenConfig.REFRESH_TOKEN_SECRET_KEY,
      {
        expiresIn: "-1s",
      }
    )

    const result =
      await getNewAccessTokenUseCase.replaceExpiredAccessToken(
        expiredRefreshToken
      )

    expect(result).toBeInstanceOf(UnauthorizedError)
  })
  it("Should return a 'BadRequestError' if the token is signed with a different key", async () => {
    const getNewAccessTokenUseCase = container.resolve(GetNewAccessTokenUseCase)
    const refreshToken = jwt.sign(
      { userId: 1, deviceId: "device_1" },
      "fake_secret",
      {
        expiresIn: "1m",
      }
    )

    const result =
      await getNewAccessTokenUseCase.replaceExpiredAccessToken(refreshToken)

    expect(result).toBeInstanceOf(BadRequestError)
  })

  it("should return BadRequestError if token is invalid", async () => {
    const getNewAccessTokenUseCase = container.resolve(GetNewAccessTokenUseCase)

    const result =
      await getNewAccessTokenUseCase.replaceExpiredAccessToken("random_token")

    expect(result).toBeInstanceOf(BadRequestError)
  })

  it("should return ", async () => {
    const getNewAccessTokenUseCase = container.resolve(GetNewAccessTokenUseCase)
    const refreshToken1 = jwt.sign(
      { userId: null, deviceId: "1" },
      tokenConfig.REFRESH_TOKEN_SECRET_KEY,
      {
        expiresIn: "1m",
      }
    )

    const result1 =
      await getNewAccessTokenUseCase.replaceExpiredAccessToken(refreshToken1)

    expect(result1).toBeInstanceOf(BadRequestError)

    const refreshToken2 = jwt.sign(
      { userId: 1, deviceId: 1 },
      tokenConfig.REFRESH_TOKEN_SECRET_KEY,
      {
        expiresIn: "1m",
      }
    )

    const result2 =
      await getNewAccessTokenUseCase.replaceExpiredAccessToken(refreshToken2)
    expect(result2).toBeInstanceOf(BadRequestError)
  })

  it("should return NotFoundError id user or device from token not exist", async () => {
    const getNewAccessTokenUseCase = container.resolve(GetNewAccessTokenUseCase)
    const refreshToken = jwt.sign(
      { userId: 1, deviceId: "device_1" },
      tokenConfig.REFRESH_TOKEN_SECRET_KEY,
      {
        expiresIn: "1m",
      }
    )

    mockGetUserById.mockImplementation(() => null)
    mockGtDeviceByDeviceId.mockImplementation(() => mockUserDevice)

    const result1 =
      await getNewAccessTokenUseCase.replaceExpiredAccessToken(refreshToken)
    expect(result1).toBeInstanceOf(NotFoundError)

    mockGetUserById.mockImplementation(() => mockUser)
    mockGtDeviceByDeviceId.mockImplementation(() => null)
    const result2 =
      await getNewAccessTokenUseCase.replaceExpiredAccessToken(refreshToken)
    expect(result2).toBeInstanceOf(NotFoundError)
  })

  it("should return UnauthorizedError if old refresh token for user not found", async () => {
    const getNewAccessTokenUseCase = container.resolve(GetNewAccessTokenUseCase)
    const refreshToken = jwt.sign(
      { userId: 1, deviceId: "device_1" },
      tokenConfig.REFRESH_TOKEN_SECRET_KEY,
      {
        expiresIn: "1m",
      }
    )
    mockGetUserById.mockImplementation(() => mockUser)
    mockGtDeviceByDeviceId.mockImplementation(() => mockUserDevice)
    mockGetTokenByValue.mockImplementation(() => null)

    const result =
      await getNewAccessTokenUseCase.replaceExpiredAccessToken(refreshToken)

    expect(mockResetAllRefreshTokensForDevice).toHaveBeenCalledTimes(1)
    expect(result).toBeInstanceOf(UnauthorizedError)
  })

  it("should return FailedToCreateError if server can't add new refresh token to database", async () => {
    const getNewAccessTokenUseCase = container.resolve(GetNewAccessTokenUseCase)
    const refreshToken = jwt.sign(
      { userId: 1, deviceId: "device_1" },
      tokenConfig.REFRESH_TOKEN_SECRET_KEY,
      {
        expiresIn: "1m",
      }
    )
    mockGetUserById.mockImplementation(() => mockUser)
    mockGtDeviceByDeviceId.mockImplementation(() => mockUserDevice)
    mockGetTokenByValue.mockImplementation(() => "random_token_value")
    mockGenerateAccessToken.mockImplementation(() => "access_token")
    mockGenerateRefreshToken.mockImplementation(() => "refresh_token")
    mockAddNewRefreshToken.mockImplementation(() => new FailedToCreateError())

    const result =
      await getNewAccessTokenUseCase.replaceExpiredAccessToken(refreshToken)

    expect(mockResetAllRefreshTokensForDeviceUseCase).toHaveBeenCalledTimes(1)
    expect(mockAddNewRefreshToken).toHaveBeenCalledTimes(1)
    expect(result).toBeInstanceOf(FailedToCreateError)
  })

  it("should return FailedToCreateError if server can't add new refresh token to database", async () => {
    const getNewAccessTokenUseCase = container.resolve(GetNewAccessTokenUseCase)
    const refreshToken = jwt.sign(
      { userId: 1, deviceId: "device_1" },
      tokenConfig.REFRESH_TOKEN_SECRET_KEY,
      {
        expiresIn: "1m",
      }
    )
    mockGetUserById.mockImplementation(() => mockUser)
    mockGtDeviceByDeviceId.mockImplementation(() => mockUserDevice)
    mockGetTokenByValue.mockImplementation(() => "random_token_value")
    mockGenerateAccessToken.mockImplementation(() => "accessToken")
    mockGenerateRefreshToken.mockImplementation(() => "refreshToken")
    mockAddNewRefreshToken.mockImplementation(() => undefined)

    const result =
      await getNewAccessTokenUseCase.replaceExpiredAccessToken(refreshToken)

    expect(mockResetAllRefreshTokensForDeviceUseCase).toHaveBeenCalledTimes(1)
    expect(mockAddNewRefreshToken).toHaveBeenCalledTimes(1)
    expect(result).toEqual({
      accessToken: "accessToken",
      refreshToken: "refreshToken",
    })
  })
})
