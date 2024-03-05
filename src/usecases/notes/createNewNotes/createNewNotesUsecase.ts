import { injectable } from "tsyringe"
import { NoteRequest } from "../../../entities/note"
import { NotesRepository } from "../../../repositories/notes.repository"
import { noteMapper } from "../../../entities/mappers/note"
import { randomUUID } from "crypto"
import { createNoteValidationSchema } from "../../../extensions/validation/notes/notes"
import { BadRequestError, UnexpectedError } from "../../../entities/errors"
import { AddNewNotesResult } from "./createNewNotesUsecase.type"

@injectable()
export class CreateNewNotesUseCase {
  constructor(private _notesRepository: NotesRepository) {}

  addNewNotes = async (notes: NoteRequest[]): AddNewNotesResult => {
    try {
      const isError = this._isParamsValid(notes)

      if (isError) {
        return new BadRequestError(isError.message)
      }

      const noteGlobalId = randomUUID()

      const result = await Promise.all(
        notes.map(async (note) => {
          const noteWithGlobalId = {
            ...note,
            metaData: { ...note.metaData, noteGlobalId },
          }
          const noteForDb = noteMapper.noteRequestToNoteDb(noteWithGlobalId)
          const result = await this._notesRepository.addNewNote(noteForDb)

          return {
            deviceId: note.metaData.sendToDeviceId,
            isSuccess: result !== null,
          }
        })
      )

      return {
        noteGlobalId,
        resultInfo: result,
      }
    } catch (err) {
      return new UnexpectedError()
    }
  }

  private _isParamsValid = (props: any[]) => {
    const validationResult = createNoteValidationSchema.validate(props)

    return validationResult.error
  }
}
