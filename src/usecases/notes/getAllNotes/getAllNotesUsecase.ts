import { injectable } from "tsyringe"
import { NotesRepository } from "../../../repositories/notes.repository"
import { UnexpectedError } from "../../../entities/errors"
import { GetAllNotesResult } from "./getAllNotesUsecase.type"
import { noteMapper } from "../../../entities/mappers/note"

@injectable()
export class GetAllNotesUsecase {
  constructor(private _notesRepository: NotesRepository) {}

  getAllNotes = async (userId: number, deviceId: string): GetAllNotesResult => {
    try {
      const res = await this._notesRepository.getAllNotes(userId, deviceId)

      const data = await Promise.all(
        res.map(async (item) => {
          const syncedNotes = await this._notesRepository.getNotesByGlobalId(
            userId,
            item.noteGlobalId
          )
          const syncedWithDeviceId = syncedNotes.map(
            (item) => item.sendToDeviceId
          )

          return noteMapper.noteToNoteResponse(item, syncedWithDeviceId)
        })
      )

      return data
    } catch (err) {
      return new UnexpectedError()
    }
  }
}
