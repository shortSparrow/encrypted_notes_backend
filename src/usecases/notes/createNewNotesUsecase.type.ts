import { BadRequestError } from "../../entities/errors"

export type AddNewNotesSuccess = {
  noteGlobalId: string
  resultInfo: {
    deviceId: string
    isSuccess: boolean
  }[]
}
export type AddNewNotesResult = Promise<BadRequestError | AddNewNotesSuccess>
