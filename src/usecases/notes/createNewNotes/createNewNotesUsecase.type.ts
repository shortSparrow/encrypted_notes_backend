import { BadRequestError, UnexpectedError } from "../../../entities/errors"

export type AddNewNotesSuccess = {
  deviceId: string
  isSuccess: boolean
  noteGlobalId: string
}[]
export type AddNewNotesResult = Promise<
  BadRequestError | UnexpectedError | AddNewNotesSuccess
>
