import jwt, { TokenExpiredError } from "jsonwebtoken"
import { tokenConfig } from "../../../config/token.config"
import {
  BadRequestError,
  FailedToCreateError,
  NotFoundError,
  UnauthorizedError,
  UnexpectedError,
} from "../../../entities/errors"
import { injectable } from "tsyringe"
import { RefreshTokenRepository } from "../../../repositories/token.repository"
import { UserRepository } from "../../../repositories/user.repository"
import { GenerateTokensUseCase } from "../generateTokens/generateTokensUseCase"
import { ReplaceExpiredAccessTokenResult } from "./getNewAccessTokenUseCase.types"
import { DeviceRepository } from "../../../repositories/device.repository"
import { UserDeviceId } from "../../../.."
import { ref } from "joi"
import { AddAndDeleteRefreshToken } from "../addAndDeleteRefreshToken/addAndDeleteRefreshTokenUseCase"

@injectable()
export class GetNewAccessTokenUseCase {
  constructor(
    private _tokenRepository: RefreshTokenRepository,
    private _userRepository: UserRepository,
    private _tokenUseCase: GenerateTokensUseCase,
    private _deviceRepository: DeviceRepository,
    private _addAndDeleteRefreshToken: AddAndDeleteRefreshToken
  ) {}

  replaceExpiredAccessToken = async (
    refreshToken: string
  ): ReplaceExpiredAccessTokenResult => {
    try {
      return new Promise((resolve, reject) => {
        jwt.verify(
          refreshToken,
          tokenConfig.REFRESH_TOKEN_SECRET_KEY,
          async (err, decoded) => {
            if (err) {
              if (err instanceof TokenExpiredError) {
                // на випадок якщо користувач довго не заходив в апку і у нього протух як access так і refresh
                return resolve(
                  new UnauthorizedError("Refresh token is expired")
                )
              }
              return resolve(new BadRequestError("Invalid token"))
            }

            const { userId, deviceId } = decoded as any

            if (typeof userId !== "number" || typeof deviceId !== "string") {
              return resolve(new BadRequestError("invalid token data"))
            }

            const user = await this._userRepository.getUserById(userId)
            const userDevice = await this._deviceRepository.getDeviceByDeviceId(
              { userId, deviceId }
            )
            if (user === null || userDevice === null) {
              return resolve(
                new NotFoundError("User with this id or device does not exist")
              )
            }

            const oldRefreshToken =
              await this._tokenRepository.getTokenByValue(refreshToken)

            if (oldRefreshToken === null) {
              // Potential that token was steal. We don't care who call api now - user or attacker. Just reset all refresh tokens
              const handleTokenCompromisedResult =
                await this._handleTokenCompromised({ userId, deviceId })

              return resolve(handleTokenCompromisedResult)
            }

            const handleUpdateTokenResult = await this._handleUpdateToken({
              userId,
              deviceId,
            })

            return resolve(handleUpdateTokenResult)
          }
        )
      })
    } catch (err) {
      return new UnexpectedError()
    }
  }

  private _handleTokenCompromised = async ({
    userId,
    deviceId,
  }: UserDeviceId) => {
    // Potential that token was steal. We don't care who call api now - user or attacker. Just reset all refresh tokens
    const isDeletedSuccess =
      await this._tokenRepository.resetAllRefreshTokensForDevice({
        userId,
        deviceId,
      })

    if (!isDeletedSuccess) {
      // TODO
    }

    return new UnauthorizedError("Invalid token")
  }

  private _handleUpdateToken = async ({ userId, deviceId }: UserDeviceId) => {
    const newRefreshToken = this._tokenUseCase.generateRefreshToken({
      userId,
      deviceId,
    })
    const newAccessToken = this._tokenUseCase.generateAccessToken({
      userId,
      deviceId,
    })

    const isDeletedSuccess =
      await this._addAndDeleteRefreshToken.resetAllRefreshTokensForDevice({
        userId,
        deviceId,
      })

    if (!isDeletedSuccess) {
      // TODO
    }

    const resultAddedNewRefresh =
      await this._addAndDeleteRefreshToken.addNewRefreshToken({
        refreshToken: newRefreshToken,
        userId,
        deviceId,
      })

    if (resultAddedNewRefresh instanceof FailedToCreateError) {
      return resultAddedNewRefresh
    }

    return {
      refreshToken: newRefreshToken,
      accessToken: newAccessToken,
    }
  }
}
