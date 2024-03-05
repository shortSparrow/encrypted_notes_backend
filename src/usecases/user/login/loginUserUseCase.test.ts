import { container } from "tsyringe"
import { LoginUserUseCase } from "./loginUserUseCase"
import {
  BadRequestError,
  NotFoundError,
  UnauthorizedError,
} from "../../../entities/errors"
import { UserRepository } from "../../../repositories/user.repository"
import { GetDeviceUseCase } from "../../userDevice/getDevice/getDeviceUseCase"
import { AddNewUserDeviceUseCase } from "../../userDevice/addNewUser/addNewUserDeviceUseCase"
import { AddAndDeleteRefreshToken } from "../../token/addAndDeleteRefreshToken/addAndDeleteRefreshTokenUseCase"
import { UserDevice } from "../../../entities/userDevice"
import { User } from "../../../entities/user"
import { GenerateTokensUseCase } from "../../token/generateTokens/generateTokensUseCase"
import { mockNoteEncryptionPublicKey } from "../../../__mock__/mockEncryption"
import { JWK } from "../../../entities/jwk"

const correctPhone = "+380663927900"
const correctPassword = "pass"

const correctParams = {
  password: correctPassword,
  phone: correctPhone,
  deviceId: "device_1",
  noteEncryptionPublicKey: mockNoteEncryptionPublicKey,
}

const fakeUserDevice = new UserDevice({ deviceId: "1", userId: 1 })
const fakeUser = new User({
  id: 1,
  passwordHashed: "password",
  name: "Senya",
  phone: correctPhone,
})

const mockComparePasswordSync = jest.fn()
const mockGetUserByPhone = jest.fn()
const mockGetDeviceById = jest.fn()
const mockAddUserDevice = jest.fn()
const mockResetAllRefreshTokensForDevice = jest.fn()
const mockAddNewRefreshToken = jest.fn()
const mockGenerateAccessToken = jest.fn()
const mockGenerateRefreshToken = jest.fn()

jest.mock("../../../utils/hashed/hashedPasswordSync", () => ({
  comparePasswordSync: () => mockComparePasswordSync(),
}))

beforeEach(() => {
  jest.clearAllMocks()
  container.clearInstances()
  container.register<UserRepository>(UserRepository, {
    useValue: {
      getUserByPhone: mockGetUserByPhone,
    } as unknown as UserRepository,
  })

  container.register<GetDeviceUseCase>(GetDeviceUseCase, {
    useValue: {
      getDeviceById: mockGetDeviceById,
    } as unknown as GetDeviceUseCase,
  })

  container.register<AddNewUserDeviceUseCase>(AddNewUserDeviceUseCase, {
    useValue: {
      addUserDevice: mockAddUserDevice,
    } as unknown as AddNewUserDeviceUseCase,
  })

  container.register<AddAndDeleteRefreshToken>(AddAndDeleteRefreshToken, {
    useValue: {
      resetAllRefreshTokensForDevice: mockResetAllRefreshTokensForDevice,
      addNewRefreshToken: mockAddNewRefreshToken,
    } as unknown as AddAndDeleteRefreshToken,
  })

  container.register<GenerateTokensUseCase>(GenerateTokensUseCase, {
    useValue: {
      generateAccessToken: mockGenerateAccessToken,
      generateRefreshToken: mockGenerateRefreshToken,
    } as unknown as GenerateTokensUseCase,
  })
})

describe("LoginUserUseCase", () => {
  it("should return BadRequestError if params is not valid", async () => {
    const registerUserUseCase = container.resolve(LoginUserUseCase)

    const result1 = await registerUserUseCase.login({
      password: "",
      phone: "",
      deviceId: "",
      noteEncryptionPublicKey: {} as JWK,
    })
    expect(result1).toBeInstanceOf(BadRequestError)

    const result2 = await registerUserUseCase.login({
      password: "",
      phone: correctPhone,
      deviceId: "",
      noteEncryptionPublicKey: {} as JWK,
    })
    expect(result2).toBeInstanceOf(BadRequestError)

    const result3 = await registerUserUseCase.login({
      password: correctPassword,
      phone: "",
      deviceId: "",
      noteEncryptionPublicKey: {} as JWK,
    })
    expect(result3).toBeInstanceOf(BadRequestError)

    const result4 = await registerUserUseCase.login({
      password: correctPassword,
      phone: correctPhone,
      deviceId: 1 as unknown as string,
      noteEncryptionPublicKey: {} as JWK,
    })
    expect(result4).toBeInstanceOf(BadRequestError)

    const result5 = await registerUserUseCase.login({
      password: correctPassword,
      phone: correctPhone,
      deviceId: "1",
      noteEncryptionPublicKey: {} as JWK,
    })
    expect(result5).toBeInstanceOf(BadRequestError)
  })

  it("should return NotFoundError user with passed id don't exist", async () => {
    const registerUserUseCase = container.resolve(LoginUserUseCase)
    mockGetUserByPhone.mockImplementation(() => null)

    const result = await registerUserUseCase.login(correctParams)
    expect(result).toBeInstanceOf(NotFoundError)
  })

  it("should return UnauthorizedError if passed password don't match the stored in database one", async () => {
    const registerUserUseCase = container.resolve(LoginUserUseCase)
    mockGetUserByPhone.mockImplementation(() => fakeUser)

    mockComparePasswordSync.mockImplementation(() => false)
    const result = await registerUserUseCase.login(correctParams)
    expect(result).toBeInstanceOf(UnauthorizedError)
  })

  it("should call AddUserDeviceUseCase and return access and refresh token", async () => {
    const registerUserUseCase = container.resolve(LoginUserUseCase)
    mockGetUserByPhone.mockImplementation(() => fakeUser)
    mockComparePasswordSync.mockImplementation(() => true)
    mockGetDeviceById.mockImplementation(() => null)
    mockAddUserDevice.mockImplementation(() => ({
      accessToken: "accessToken",
      refreshToken: "refreshToken",
    }))

    const result = await registerUserUseCase.login(correctParams)
    expect(mockAddUserDevice).toHaveBeenCalledTimes(1)
    expect(result).toEqual({
      accessToken: "accessToken",
      refreshToken: "refreshToken",
    })
  })

  it("should call ", async () => {
    const registerUserUseCase = container.resolve(LoginUserUseCase)
    mockGetUserByPhone.mockImplementation(() => fakeUser)
    mockComparePasswordSync.mockImplementation(() => true)
    mockGetDeviceById.mockImplementation(() => fakeUserDevice)
    mockGenerateAccessToken.mockImplementation(() => "accessToken")
    mockGenerateRefreshToken.mockImplementation(() => "refreshToken")

    const result = await registerUserUseCase.login(correctParams)
    expect(mockResetAllRefreshTokensForDevice).toHaveBeenCalledTimes(1)
    expect(mockAddNewRefreshToken).toHaveBeenCalledTimes(1)
    expect(result).toEqual({
      accessToken: "accessToken",
      refreshToken: "refreshToken",
    })
  })
})
