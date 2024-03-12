import { Request, Response } from "express"

import { container } from "tsyringe"
import { UnexpectedError } from "../../entities/errors"
import { LogoutUseCase } from "../../usecases/user/logout/logoutUseCase"

export const logoutController = async (req: Request, res: Response) => {
  const userId = req.verifiedToken?.userId as number
  const deviceId = req.verifiedToken?.deviceId as string

  const logoutUseCase = container.resolve(LogoutUseCase)
  const result = await logoutUseCase.logout(userId, deviceId)

  if (result instanceof UnexpectedError) {
    return res.status(result.code).json({ message: "Unexpected error" })
  }

  return res.status(200).send()
}
