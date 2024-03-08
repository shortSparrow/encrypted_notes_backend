import { BadRequestError, UnexpectedError } from "../../../entities/errors"
import { NoteRequest } from "../../../entities/note"

export type EditNotesRequest = Omit<NoteRequest, "metaData.noteGlobalId"> & {
  metaData: { noteGlobalId: string }
}

export type EditNotesSuccess = {
  deviceId: string
  isSuccess: boolean
  noteGlobalId: string
}[]

export type EditNotesResult = Promise<
  BadRequestError | UnexpectedError | EditNotesSuccess
>
