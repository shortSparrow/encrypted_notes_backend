import { injectable } from "tsyringe"
import { DeviceRepository } from "../../../repositories/device.repository"
import { userDeviceValidationSchema } from "../../../extensions/validation/userDevice/addNewDevice"
import { TokenUseCase } from "../../token/tokenUseCase"
import {
  BadRequestError,
  FailedToCreateError,
} from "../../../entities/errors"
import { AddUserProps, AddUserResponse } from "./addNewUserDeviceUseCase.types"

@injectable()
export class AddNewUserDeviceUseCase {
  constructor(
    private _deviceRepository: DeviceRepository,
    private _tokenUseCase: TokenUseCase
  ) {}

  private _isParamsValid = ({
    deviceId,
    name,
    type,
    operationSystem,
  }: any) => {
    const validationResult = userDeviceValidationSchema.validate({
      deviceId,
      name,
      type,
      operationSystem,
    })

    if (validationResult.error) {
      return new BadRequestError(validationResult.error.message)
    }

    return true
  }

  addUserDevice = async (params: AddUserProps): AddUserResponse => {
    const { deviceId, userId, name, type, operationSystem } = params
    const validationResult = this._isParamsValid({
      deviceId,
      name,
      type,
      operationSystem,
    })
    if (validationResult instanceof BadRequestError) {
      return validationResult
    }

    const id = await this._deviceRepository.addNewUserDevice({
      deviceId,
      userId,
      name,
      type,
      operationSystem,
    })

    if (id === null) {
      return new FailedToCreateError("Can't register new user device")
    }

    const accessToken = this._tokenUseCase.generateAccessToken(userId)
    const refreshToken = this._tokenUseCase.generateRefreshToken(userId)

    this._tokenUseCase.addNewRefreshToken({
      userId,
      deviceId,
      refreshToken,
    })

    return { accessToken, refreshToken }
  }
}
