import { Request, Response } from "express"
import { container } from "tsyringe"
import { AddNewUserDeviceUseCase } from "../../usecases/userDevice/addNewUser/addNewUserDeviceUseCase"
import {
  BadRequestError,
  FailedToCreateError,
} from "../../entities/errors"

export const addNewDeviceController = async (req: Request, res: Response) => {
  const { deviceId, name, type, operationSystem } = req.body

  const addNewUserDeviceUseCase = container.resolve(AddNewUserDeviceUseCase)

  // // ! userId must got from auth middleware and added to request.body
  // const result = await addNewUserDeviceUseCase.addUserDevice({
  //   userId: userId,
  //   deviceId,
  //   name,
  //   type,
  //   operationSystem,
  // })

  // if (
  //   result instanceof BadRequestError ||
  //   result instanceof FailedToCreateError
  // ) {
  //   return res.status(result.code).json({ message: result.message })
  // }
}
