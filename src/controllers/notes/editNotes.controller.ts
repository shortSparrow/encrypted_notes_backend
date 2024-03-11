import { Request, Response } from "express"
import { container } from "tsyringe"
import { BadRequestError, UnexpectedError } from "../../entities/errors"
import { EditNotesUseCase } from "../../usecases/notes/editNotes/editNotesUsecase"

export const editNotesController = async (req: Request, res: Response) => {
  const userId = req.verifiedToken?.userId as number
  const deviceId = req.verifiedToken?.deviceId as string
  const editNewNotesUseCase = container.resolve(EditNotesUseCase)

  const result = await editNewNotesUseCase.editNotes({
    sendFromDeviceId: deviceId,
    userId,
    updatedNotes: req.body,
  })

  if (result instanceof BadRequestError || result instanceof UnexpectedError) {
    return res.status(result.code).json({ message: result.message })
  }

  return res.status(200).json(result)
}
