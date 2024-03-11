import { Request, Response } from "express"
import { container } from "tsyringe"
import { BadRequestError, UnexpectedError } from "../../entities/errors"
import { DeleteNoteUsecase } from "../../usecases/notes/deleteNote/deleteNoteUsecase"

export const deleteNotesController = async (
  req: Request<{}, any, any, { noteGlobalId: string }>,
  res: Response
) => {
  const userId = req.verifiedToken?.userId as number
  const { noteGlobalId } = req.query
  const deleteNoteUsecase = container.resolve(DeleteNoteUsecase)

  const result = await deleteNoteUsecase.deleteNotes(userId, noteGlobalId)

  if (result instanceof UnexpectedError || result instanceof BadRequestError) {
    return res.status(result.code).json({ message: result.message })
  }

  return res.status(200).json({ isSuccess: result })
}
