import {
  BadRequestError,
  FailedToCreateError,
  NotFoundError,
  UnauthorizedError,
  UnknownError,
} from "../../../entities/errors"

export type LoginSuccessResponse = { accessToken: string; refreshToken: string }
export type LoginUserProps = {
  phone: string
  password: string
  deviceId: string
}

export type LoginUserResponse = Promise<
  | NotFoundError
  | BadRequestError
  | UnauthorizedError
  | UnknownError
  | FailedToCreateError
  | LoginSuccessResponse
>
