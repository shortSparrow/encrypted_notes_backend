import { Request, Response } from "express"

import { container } from "tsyringe"
import {
  BadRequestError,
  FailedToCreateError,
  NotFoundError,
  UnauthorizedError,
  UnknownError,
} from "../../entities/errors"
import { GetNewAccessTokenUseCase } from "../../usecases/token/getNewAccessToken/getNewAccessTokenUseCase"

export const getNewAccessTokenController = async (
  req: Request,
  res: Response
) => {
  // TODO maybe for web send refreshToken in cookie (more secure)
  const refreshToken = req.body.refreshToken

  if (typeof refreshToken !== "string") {
    return res.status(400).json({ message: "Invalid refresh token" })
  }

  const getNewAccessTokenUseCase = container.resolve(GetNewAccessTokenUseCase)
  const result =
    await getNewAccessTokenUseCase.replaceExpiredAccessToken(refreshToken)

  if (
    result instanceof BadRequestError ||
    result instanceof NotFoundError ||
    result instanceof BadRequestError ||
    result instanceof FailedToCreateError ||
    result instanceof UnauthorizedError ||
    result instanceof UnknownError
  ) {
    return res.status(result.code).json({ message: result.message })
  }

  return res.status(200).send({
    accessToken: result.accessToken,
    refreshToken: result.refreshToken,
  })
}
