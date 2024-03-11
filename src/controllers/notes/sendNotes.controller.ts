import { Request, Response } from "express"
import { container } from "tsyringe"
import { CreateNewNotesUseCase } from "../../usecases/notes/createNewNotes/createNewNotesUsecase"
import { BadRequestError, UnexpectedError } from "../../entities/errors"

export const sendNotesController = async (req: Request, res: Response) => {
  const createNewNotesUseCase = container.resolve(CreateNewNotesUseCase)
  const userId = req.verifiedToken?.userId as number
  const deviceId = req.verifiedToken?.deviceId as string

  const result = await createNewNotesUseCase.addNewNotes({
    userId,
    sendFromDeviceId: deviceId,
    notes: req.body,
  })

  if (result instanceof BadRequestError || result instanceof UnexpectedError) {
    return res.status(result.code).json({ message: result.message })
  }

  return res.status(200).json(result)
}
