import {
  BadRequestError,
  FailedToCreateError,
  NotFoundError,
  UnauthorizedError,
  UnknownError,
} from "../../../entities/errors"

export type ReplaceExpiredAccessTokenResult = Promise<
  | BadRequestError
  | NotFoundError
  | UnauthorizedError
  | FailedToCreateError
  | UnknownError
  | { refreshToken: string; accessToken: string }
>
