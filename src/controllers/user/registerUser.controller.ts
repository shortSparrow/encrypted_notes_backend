import { Request, Response } from "express"

import { container } from "tsyringe"
import { RegisterUserUseCase } from "../../usecases/user/register/registerUserUseCase"
import { AddNewUserDeviceUseCase } from "../../usecases/userDevice/addNewUser/addNewUserDeviceUseCase"
import {
  BadRequestError,
  ConflictError,
  FailedToCreateError,
} from "../../entities/errors"

export const registerController = async (req: Request, res: Response) => {
  const { phone, password, deviceId } = req.body

  const registerUseCase = container.resolve(RegisterUserUseCase)
  const addNewUserDeviceUseCase = container.resolve(AddNewUserDeviceUseCase)

  const responseRegisterUser = await registerUseCase.registerUser({
    phone,
    password,
  })

  if (
    responseRegisterUser instanceof ConflictError ||
    responseRegisterUser instanceof FailedToCreateError ||
    responseRegisterUser instanceof BadRequestError
  ) {
    return res
      .status(responseRegisterUser.code)
      .json({ message: responseRegisterUser.message })
  }

  const responseRegisterDevice = await addNewUserDeviceUseCase.addUserDevice({
    userId: responseRegisterUser.id,
    deviceId: deviceId,
  })

  if (responseRegisterDevice instanceof BadRequestError) {
    return res.status(520).json({
      message: responseRegisterDevice.message,
    })
  }

  // Якась фігня, як тоді на клієнті я це відловлю? Можливо надіслати спеціальний код
  if (responseRegisterDevice instanceof FailedToCreateError) {
    return res.status(520).json({
      message: "User registered but" + responseRegisterDevice.message,
    })
  }

  // ! how to user setCookie if userAgent is not a browser?
  // ! token should be for each mobileDevice not for user

  return res.status(200).json({
    accessToken: responseRegisterDevice.accessToken,
    refreshToken: responseRegisterDevice.refreshToken,
  })
}
