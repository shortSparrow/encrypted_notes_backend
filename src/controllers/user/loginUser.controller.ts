import { Request, Response } from "express"

import { container } from "tsyringe"
import { LoginUserUseCase } from "../../usecases/user/login/loginUserUseCase"
import {
  BadRequestError,
  FailedToCreateError,
  NotFoundError,
  UnauthorizedError,
  UnknownError,
} from "../../entities/errors"

export const loginController = async (req: Request, res: Response) => {
  const { phone, password, deviceId } = req.body

  const loginUseCase = container.resolve(LoginUserUseCase)
  const result = await loginUseCase.login({
    phone: phone,
    password: password,
    deviceId: deviceId,
  })

  if (result instanceof NotFoundError || result instanceof UnauthorizedError) {
    return res.status(401).send("Phone or password is invalid")
  }

  if (result instanceof FailedToCreateError || result instanceof BadRequestError) {
    return res.status(result.code).send(result.message)
  }

  if (result instanceof UnknownError) {
    return res.status(520).send("Unknown error happened")
  }

  return res.status(200).send({
    accessToken: result.accessToken,
    refreshToken: result.refreshToken,
  })
}
