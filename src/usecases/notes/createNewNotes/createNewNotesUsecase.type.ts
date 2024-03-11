import { BadRequestError, UnexpectedError } from "../../../entities/errors"
import { NoteRequest } from "../../../entities/note"

export type AddNewNotesSuccess = {
  sendToDeviceId: string
  isSuccess: boolean
  noteGlobalId: string
}[]

export type AddNewNotesProps = {
  userId: number,
  notes: NoteRequest[],
  sendFromDeviceId: string
}
export type AddNewNotesResult = Promise<
  BadRequestError | UnexpectedError | AddNewNotesSuccess
>
