import { injectable } from "tsyringe"
import { NotesRepository } from "../../../repositories/notes.repository"
import { editNoteValidationSchema } from "../../../extensions/validation/notes/notes"
import { BadRequestError, UnexpectedError } from "../../../entities/errors"
import { DeviceRepository } from "../../../repositories/device.repository"
import { EditNotesProps, EditNotesResult } from "./editNotesUsecase.type"
import { noteMapper } from "../../../entities/mappers/note"

@injectable()
export class EditNotesUseCase {
  constructor(
    private _notesRepository: NotesRepository,
    private _deviceRepository: DeviceRepository
  ) {}

  editNotes = async ({
    updatedNotes,
    userId,
    sendFromDeviceId,
  }: EditNotesProps): EditNotesResult => {
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
              sendToDeviceId: note.metaData.sendToDeviceId,
              noteGlobalId: note.metaData.noteGlobalId,
              isSuccess: false,
            }
          }

          const noteForDb = noteMapper.noteRequestToNoteForDb(
            {
              ...note,
              metaData: { ...note.metaData },
            },
            sendFromDeviceId
          )

          const result = await this._notesRepository.editNote(userId, noteForDb)

          return {
            sendToDeviceId: note.metaData.sendToDeviceId,
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
