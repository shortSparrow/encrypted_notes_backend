import { container } from "tsyringe"
import { RegisterUserUseCase } from "./registerUserUseCase"
import { BadRequestError, ConflictError, FailedToCreateError } from "../../../entities/errors"
import { UserRepository } from "../../../repositories/user.repository"

const correctPhone = "+380663927900"
const correctPassword = "pass"

const mockGetUserByPhone = jest.fn()
const mockCreateUser = jest.fn()

beforeEach(() => {
  jest.clearAllMocks()
  container.clearInstances()
  container.register<UserRepository>(UserRepository, {
    useValue: {
      getUserByPhone: mockGetUserByPhone,
      createUser: mockCreateUser,
    } as unknown as UserRepository,
  })
})

describe("RegisterUserUseCase", () => {
  it("should return BadRequestError if phone or password invalid", async () => {
    const registerUserUseCase = container.resolve(RegisterUserUseCase)
    const result1 = await registerUserUseCase.registerUser({
      phone: "",
      password: "",
    })
    expect(result1).toBeInstanceOf(BadRequestError)

    const result2 = await registerUserUseCase.registerUser({
      phone: "as",
      password: correctPassword,
    })
    expect(result2).toBeInstanceOf(BadRequestError)

    const result3 = await registerUserUseCase.registerUser({
      phone: "927900",
      password: correctPassword,
    })
    expect(result3).toBeInstanceOf(BadRequestError)

    const result4 = await registerUserUseCase.registerUser({
      phone: correctPhone,
      password: "1",
    })
    expect(result4).toBeInstanceOf(BadRequestError)
  })

  it("should return ConflictError user with passed id not found", async () => {
    const registerUserUseCase = container.resolve(RegisterUserUseCase)
    mockGetUserByPhone.mockImplementation(() => {
      return {}
    })
    const result = await registerUserUseCase.registerUser({
      phone: correctPhone,
      password: correctPassword,
    })

    expect(result).toBeInstanceOf(ConflictError)
  })

  it("should return FailedToCreateError if creating new user faw failed", async () => {
    const registerUserUseCase = container.resolve(RegisterUserUseCase)
    mockGetUserByPhone.mockImplementation(() => {
      return null
    })
    mockCreateUser.mockImplementation(() => {
      return null
    })
    const result = await registerUserUseCase.registerUser({
      phone: correctPhone,
      password: correctPassword,
    })

    expect(result).toBeInstanceOf(FailedToCreateError)
  })

  it("should return userId if user created successfully", async () => {
    const registerUserUseCase = container.resolve(RegisterUserUseCase)
    mockGetUserByPhone.mockImplementation(() => {
      return null
    })
    mockCreateUser.mockImplementation(() => {
      return 7
    })
    const result = await registerUserUseCase.registerUser({
      phone: correctPhone,
      password: correctPassword,
    })

    expect((result as any).id).toBe(7)
  })
})
