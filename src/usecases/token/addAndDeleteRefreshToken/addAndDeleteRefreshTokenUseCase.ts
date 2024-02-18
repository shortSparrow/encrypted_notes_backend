import { injectable } from "tsyringe"
import { RefreshTokenRepository } from "../../../repositories/token.repository"
import {
  AddNewRefreshTokenProps,
  AddNewRefreshTokenResult,
} from "./addAndDeleteRefreshTokenUseCase.types"
import { FailedToCreateError } from "../../../entities/errors"
import { UserDeviceId } from "../../../.."

@injectable()
export class AddAndDeleteRefreshToken {
  constructor(private _tokenRepository: RefreshTokenRepository) {}

  addNewRefreshToken = async (
    params: AddNewRefreshTokenProps
  ): AddNewRefreshTokenResult => {
    const tokenId = await this._tokenRepository.addNewRefreshToken(params)
    if (tokenId === null) {
      return new FailedToCreateError("Failed to create refresh token")
    }
  }

  resetAllRefreshTokensForDevice = async (
    params: UserDeviceId
  ): Promise<boolean> => {
    try {
      this._tokenRepository.resetAllRefreshTokensForDevice({
        userId: params.userId,
        deviceId: params.deviceId,
      })
      return true
    } catch (err) {
      console.log("Failed to reset tokens: ", err)
      return false
    }
  }
}
