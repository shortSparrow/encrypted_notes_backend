import { Request, Response } from "express"
import { container } from "tsyringe"
import { BadRequestError, UnexpectedError } from "../../entities/errors"
import { EditNewNotesUseCase } from "../../usecases/notes/editNewNotes/editNewNotesUsecase"

export const editNotesController = async (req: Request, res: Response) => {
  const userId = req.verifiedToken?.userId as number
  const editNewNotesUseCase = container.resolve(EditNewNotesUseCase)

  const result = await editNewNotesUseCase.editNotes(userId, req.body)

  if (result instanceof BadRequestError || result instanceof UnexpectedError) {
    return res.status(result.code).json({ message: result.message })
  }

  return res.status(200).json(result)
}
