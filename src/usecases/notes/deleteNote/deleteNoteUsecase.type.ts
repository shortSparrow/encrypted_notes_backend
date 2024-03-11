import { BadRequestError, UnexpectedError } from "../../../entities/errors"

export type DeleteNoteResult = Promise<
  UnexpectedError | BadRequestError | boolean
>
