import { UnexpectedError } from "../../../entities/errors"
import { NoteResponse } from "../../../entities/note"

export type GetAllNotesResult = Promise<UnexpectedError | NoteResponse[]>
