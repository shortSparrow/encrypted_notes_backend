import { injectable } from "tsyringe"
import { NotesRepository } from "../../../repositories/notes.repository"
import { BadRequestError, UnexpectedError } from "../../../entities/errors"

import { deleteNoteIdValidationSchema } from "../../../extensions/validation/notes/notesParamsQuery"
import { DeleteNoteResult } from "./deleteNoteUsecase.type"

@injectable()
export class DeleteNoteUsecase {
  constructor(private _notesRepository: NotesRepository) {}

  deleteNotes = async (
    userId: number,
    globalNoteId: string
  ): DeleteNoteResult => {
    try {
      const isError = this._isParamsValid({ globalNoteId })

      if (isError) {
        return new BadRequestError(isError.message)
      }

      const res = await this._notesRepository.deleteNotes(userId, globalNoteId)

      return res
    } catch (err) {
      return new UnexpectedError()
    }
  }

  private _isParamsValid = (props: { globalNoteId: string }) => {
    const validationResult = deleteNoteIdValidationSchema.validate(props)

    return validationResult.error
  }
}
