import { Request, Response } from "express"
import { container } from "tsyringe"
import { GetAllNotesUsecase } from "../../usecases/notes/getAllNotes/getAllNotesUsecase"
import { UnexpectedError } from "../../entities/errors"

export const getAllNotesController = async (req: Request, res: Response) => {
  const userId = req.verifiedToken?.userId as number
  const deviceId = req.verifiedToken?.deviceId as string
  const getAllNotesUsecase = container.resolve(GetAllNotesUsecase)

  const result = await getAllNotesUsecase.getAllNotes(userId, deviceId)

  if (result instanceof UnexpectedError) {
    return res.status(result.code).json({ message: result.message })
  }

  return res.status(200).json(result)
}
