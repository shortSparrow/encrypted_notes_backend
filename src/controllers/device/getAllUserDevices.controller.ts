import { Request, Response } from "express"
import { container } from "tsyringe"
import { GetAllUserDevicesUseCase } from "../../usecases/userDevice/getAllUserDevices/getAllUserDevicesUseCase"
import { UnexpectedError } from "../../entities/errors"

export const getAllUserDevicesController = async (
  req: Request,
  res: Response
) => {
  const userId = req.verifiedToken?.userId as number
  const deviceId = req.verifiedToken?.deviceId as string
  const getAllUserDevicesUseCase = container.resolve(GetAllUserDevicesUseCase)

  const userDevicesResponse =
    await getAllUserDevicesUseCase.getAllUserDevices(userId, deviceId)

  if (userDevicesResponse instanceof UnexpectedError) {
    return res
      .status(userDevicesResponse.code)
      .json({ message: "Unexpected error happen" })
  }

  return res.status(200).json({ message: userDevicesResponse })
}
