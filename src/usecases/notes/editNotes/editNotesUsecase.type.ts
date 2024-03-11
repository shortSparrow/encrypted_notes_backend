import { BadRequestError, UnexpectedError } from "../../../entities/errors"
import { NoteRequest } from "../../../entities/note"

export type EditNotesRequest = Omit<NoteRequest, "metaData.noteGlobalId"> & {
  metaData: { noteGlobalId: string }
}

export type EditNotesSuccess = {
  sendToDeviceId: string
  isSuccess: boolean
  noteGlobalId: string
}[]

export type EditNotesProps = {
  sendFromDeviceId: string,
  userId: number,
  updatedNotes: EditNotesRequest[]
}

export type EditNotesResult = Promise<
  BadRequestError | UnexpectedError | EditNotesSuccess
>
