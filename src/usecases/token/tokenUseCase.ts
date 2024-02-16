import jwt from "jsonwebtoken"
import { tokenConfig } from "../../config/token.config"
import { injectable } from "tsyringe"
import { TokenRepository } from "../../repositories/token.repository"
import { query } from "../../utils/db/query"
import {
  AddNewRefreshTokenProps,
  ResetAllRefreshTokensForDeviceProps,
} from "./tokenUseCase.types"
import { FailedToCreateError } from "../../entities/errors"

/**
 * About tokens:
 * I have 2 approaches:
 * 1. Put the userId into the token and identify the user by parsing the token to get the userId.
 * 2. Use the token as an identifier, because each user will have their own unique token stored in the DB.
 *    When a token is received from a user, I will look up this token in the DB to find and retrieve the corresponding userId.
 *
 * * Now I user 1 approach
 */

@injectable()
export class TokenUseCase {
  constructor(private _tokenRepository: TokenRepository) {}

  generateAccessToken = (userId: number) => {
    return jwt.sign({ userId }, tokenConfig.ACCESS_TOKEN_SECRET_KEY, {
      expiresIn: "1m", // TODO change to 1 hour or 0.5 day
    })
  }

  // without Date.now() generateRefreshToken called twice at the same time return the same value
  generateRefreshToken = (userId: number) => {
    return jwt.sign(
      { userId, timeCreated: Date.now() },
      tokenConfig.REFRESH_TOKEN_SECRET_KEY,
      {
        expiresIn: "1h", // TODO change to 0.5-1 month
      }
    )
  }

  addNewRefreshToken = async (
    params: AddNewRefreshTokenProps
  ): Promise<FailedToCreateError | undefined> => {
    const tokenId = await this._tokenRepository.addNewRefreshToken(params)
    if (tokenId === null) {
      return new FailedToCreateError("Failed to create refresh token")
    }
  }

  resetAllRefreshTokensForDevice = async (
    params: ResetAllRefreshTokensForDeviceProps
  ): Promise<boolean> => {
    try {
      await query(
        "DELETE from device_refresh_tokens WHERE user_id=$1 AND device_id=$2;",
        [params.userId, params.deviceId]
      )
      return true
    } catch (err) {
      console.log("Failed to reset tokens: ", err)
      return false
    }
  }
}
