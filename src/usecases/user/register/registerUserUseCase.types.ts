import {
  BadRequestError,
  ConflictError,
  FailedToCreateError,
} from "../../../entities/errors"

export type RegisterUserProps = {
  phone: string
  password: string
}

type RegisterUserResponse = {
  id: number
}

export type RegisterUserResult = Promise<
  ConflictError | FailedToCreateError | BadRequestError | RegisterUserResponse
>
