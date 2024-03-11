import { injectable } from "tsyringe"
import { NotesRepository } from "../../../repositories/notes.repository"
import { noteMapper } from "../../../entities/mappers/note"
import { randomUUID } from "crypto"
import { createNoteValidationSchema } from "../../../extensions/validation/notes/notes"
import { BadRequestError, UnexpectedError } from "../../../entities/errors"
import {
  AddNewNotesProps,
  AddNewNotesResult,
} from "./createNewNotesUsecase.type"
import { DeviceRepository } from "../../../repositories/device.repository"

@injectable()
export class CreateNewNotesUseCase {
  constructor(
    private _notesRepository: NotesRepository,
    private _deviceRepository: DeviceRepository
  ) {}

  addNewNotes = async ({
    notes,
    userId,
    sendFromDeviceId,
  }: AddNewNotesProps): AddNewNotesResult => {
    try {
      const isError = this._isParamsValid(notes)

      if (isError) {
        return new BadRequestError(isError.message)
      }

      const noteGlobalId = randomUUID()

      const result = await Promise.all(
        notes.map(async (note) => {
          const recipientDevice =
            await this._deviceRepository.getDeviceByDeviceId({
              deviceId: note.metaData.sendToDeviceId,
              userId,
            })
          const isRecipientExist = recipientDevice !== null

          if (!isRecipientExist) {
            return {
              sendToDeviceId: note.metaData.sendToDeviceId,
              noteGlobalId: noteGlobalId,
              isSuccess: false,
            }
          }

          const noteWithGlobalId = {
            ...note,
            metaData: { ...note.metaData, noteGlobalId },
          }
          const noteForDb = noteMapper.noteRequestToNoteForDb(noteWithGlobalId, sendFromDeviceId)
          const result = await this._notesRepository.addNewNote(
            userId,
            noteForDb
          )

          return {
            sendToDeviceId: note.metaData.sendToDeviceId,
            noteGlobalId: noteGlobalId,
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
    const validationResult = createNoteValidationSchema.validate(props)

    return validationResult.error
  }
}
