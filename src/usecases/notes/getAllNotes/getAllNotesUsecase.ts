import { injectable } from "tsyringe"
import { NotesRepository } from "../../../repositories/notes.repository"
import { UnexpectedError } from "../../../entities/errors"
import { GetAllNotesResult } from "./getAllNotesUsecase.type"
import { noteMapper } from "../../../entities/mappers/note"

@injectable()
export class GetAllNotesUsecase {
  constructor(private _notesRepository: NotesRepository) {}

  getAllNotes = async (userId: number, deviceId: string): GetAllNotesResult => {
    console.log('deviceId: ', deviceId)
    try {
      const res = await this._notesRepository.getAllNotes(userId, deviceId)

      return res.map((note) => noteMapper.noteToNoteResponse(note))
    } catch (err) {
      console.log("Err: ", err)
      return new UnexpectedError()
    }
  }
}
