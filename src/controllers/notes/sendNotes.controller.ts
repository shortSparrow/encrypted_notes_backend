import { Request, Response } from "express"
import { container } from "tsyringe"
import { CreateNewNotesUseCase } from "../../usecases/notes/createNewNotesUsecase"
import { BadRequestError } from "../../entities/errors"

// Спотаку роблю ьез auth middleware, а потфм додаю і тестую вже з токенами
export const sendNotesController = async (req: Request, res: Response) => {
  const createNewNotesUseCase = container.resolve(CreateNewNotesUseCase)

  const result = await createNewNotesUseCase.addNewNotes(req.body.data)

  if (result instanceof BadRequestError) {
    return res.status(result.code).json({ message: result.message })
  }

  return res.status(200).json(result)
}
