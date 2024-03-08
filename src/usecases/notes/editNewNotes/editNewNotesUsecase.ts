import { injectable } from "tsyringe"
import { NoteRequest } from "../../../entities/note"
import { NotesRepository } from "../../../repositories/notes.repository"
import { editNoteValidationSchema } from "../../../extensions/validation/notes/notes"
import { BadRequestError, UnexpectedError } from "../../../entities/errors"
import { DeviceRepository } from "../../../repositories/device.repository"
import { EditNotesRequest, EditNotesResult } from "./editNewNotesUsecase.type"
import { noteMapper } from "../../../entities/mappers/note"

@injectable()
export class EditNewNotesUseCase {
  constructor(
    private _notesRepository: NotesRepository,
    private _deviceRepository: DeviceRepository
  ) {}

  editNotes = async (
    userId: number,
    updatedNotes: EditNotesRequest[]
  ): EditNotesResult => {
    try {
      const isError = this._isParamsValid(updatedNotes)

      if (isError) {
        return new BadRequestError(isError.message)
      }

      const result = await Promise.all(
        updatedNotes.map(async (note) => {
          const recipientDevice =
            await this._deviceRepository.getDeviceByDeviceId({
              deviceId: note.metaData.sendToDeviceId,
              userId,
            })

          const isRecipientExist = recipientDevice !== null

          if (!isRecipientExist) {
            return {
              deviceId: note.metaData.sendToDeviceId,
              noteGlobalId: note.metaData.noteGlobalId,
              isSuccess: false,
            }
          }

          const noteForDb = noteMapper.noteRequestToNoteDb(note)
          const result = await this._notesRepository.editNote(userId, noteForDb)

          return {
            deviceId: note.metaData.sendToDeviceId,
            noteGlobalId: note.metaData.noteGlobalId,
            isSuccess: result !== null,
          }
        })
      )

      return result
    } catch (err) {
      return new UnexpectedError()
    }
  }

  private _isParamsValid = (props: any[]) => {
    const validationResult = editNoteValidationSchema.validate(props)

    return validationResult.error
  }
}
