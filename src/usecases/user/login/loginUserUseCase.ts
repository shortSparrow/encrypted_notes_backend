import { injectable } from "tsyringe"
import { UserRepository } from "../../../repositories/user.repository"
import {
  BadRequestError,
  FailedToCreateError,
  NotFoundError,
  UnauthorizedError,
  UnknownError,
} from "../../../entities/errors"
import { comparePasswordSync } from "../../../utils/hashed/hashedPasswordSync"
import { TokenUseCase } from "../../token/tokenUseCase"
import { GetDeviceUseCase } from "../../userDevice/getDevice/getDeviceUseCase"
import { AddNewUserDeviceUseCase } from "../../userDevice/addNewUser/addNewUserDeviceUseCase"
import { LoginUserProps, LoginUserResponse } from "./loginUserUseCase.types"
import { loginValidationSchema } from "../../../extensions/validation/user/user"

@injectable()
export class LoginUserUseCase {
  constructor(
    private _userRepository: UserRepository,
    private _tokenUseCase: TokenUseCase,
    private _getDeviceUseCase: GetDeviceUseCase,
    private _addNewUserDeviceUseCase: AddNewUserDeviceUseCase
  ) {}

  login = async (params: LoginUserProps): LoginUserResponse => {
    try {
      const isError = this._isParamsValid(params)

      if (isError) {
        return new BadRequestError(isError.message)
      }

      const user = await this._userRepository.getUserByPhone(params.phone)
      if (user === null) {
        return new NotFoundError("User with this phone doesn't exist")
      }

      const isPasswordMatched = comparePasswordSync({
        dbPassword: user.hashedPassword,
        userPassword: params.password,
      })

      if (!isPasswordMatched) {
        return new UnauthorizedError("phone or password invalid")
      }

      const device = await this._getDeviceUseCase.getDeviceById(params.deviceId)

      if (device === null) {
        return this._loginFromNewDevice(params.deviceId, user.id)
      }

      return this._loginFromExistingDevice(params.deviceId, user.id)
    } catch (err) {
      console.log("Error: ", err)
      return new UnknownError(`Unknown error: ${err}`)
    }
  }

  private _isParamsValid = (props: LoginUserProps) => {
    const { phone, password, deviceId } = props
    const validationResult = loginValidationSchema.validate({
      password,
      phone,
      deviceId,
    })

    return validationResult.error
  }

  private _loginFromNewDevice = async (deviceId: string, userId: number) => {
    const newDeviceResponse = await this._addNewUserDeviceUseCase.addUserDevice(
      { deviceId, userId }
    )

    if (
      newDeviceResponse instanceof FailedToCreateError ||
      newDeviceResponse instanceof BadRequestError
    ) {
      return newDeviceResponse
    }

    return {
      accessToken: newDeviceResponse.accessToken,
      refreshToken: newDeviceResponse.refreshToken,
    }
  }

  private _loginFromExistingDevice = async (
    deviceId: string,
    userId: number
  ) => {
    const accessToken = this._tokenUseCase.generateAccessToken(userId)
    const refreshToken = this._tokenUseCase.generateRefreshToken(userId)
    const isResultSuccess =
      await this._tokenUseCase.resetAllRefreshTokensForDevice({
        userId,
        deviceId,
      })

    if (!isResultSuccess) {
      // TODO log something or hale this (only for server side.. User should not know about it)
    }

    const addedTokenResult = await this._tokenUseCase.addNewRefreshToken({
      refreshToken,
      userId,
      deviceId,
    })

    if (addedTokenResult instanceof FailedToCreateError) {
      return addedTokenResult
    }

    return { accessToken, refreshToken }
  }
}
