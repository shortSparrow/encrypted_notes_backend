import jwt from "jsonwebtoken"
import { tokenConfig } from "../../../config/token.config"
import { injectable } from "tsyringe"
import { AuthToken } from "../../../.."

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
export class GenerateTokensUseCase {
  generateAccessToken = ({ userId, deviceId }: AuthToken) => {
    return jwt.sign({ userId, deviceId }, tokenConfig.ACCESS_TOKEN_SECRET_KEY, {
      expiresIn: "1d", // TODO change to 1 hour or 0.5 day
    })
  }

  // without Date.now() generateRefreshToken called twice at the same time return the same value
  generateRefreshToken = ({ userId, deviceId }: AuthToken) => {
    return jwt.sign(
      { userId, deviceId, timeCreated: Date.now() },
      tokenConfig.REFRESH_TOKEN_SECRET_KEY,
      {
        expiresIn: "30 days", // TODO change to 0.5-1 month
      }
    )
  }
}
