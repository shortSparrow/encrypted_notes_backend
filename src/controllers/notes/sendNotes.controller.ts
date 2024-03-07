import { Request, Response } from "express"
import { container } from "tsyringe"
import { CreateNewNotesUseCase } from "../../usecases/notes/createNewNotes/createNewNotesUsecase"
import { BadRequestError } from "../../entities/errors"

export const sendNotesController = async (req: Request, res: Response) => {
  const createNewNotesUseCase = container.resolve(CreateNewNotesUseCase)
  const userId = req.verifiedToken?.userId as number

  const result = await createNewNotesUseCase.addNewNotes(userId, req.body)

  if (result instanceof BadRequestError) {
    return res.status(result.code).json({ message: result.message })
  }

  return res.status(200).json(result)
}
