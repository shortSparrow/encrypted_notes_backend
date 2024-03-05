import {
  BadRequestError,
  FailedToCreateError,
  NotFoundError,
  UnauthorizedError,
  UnexpectedError,
} from "../../../entities/errors"

export type ReplaceExpiredAccessTokenResult = Promise<
  | BadRequestError
  | NotFoundError
  | UnauthorizedError
  | FailedToCreateError
  | UnexpectedError
  | { refreshToken: string; accessToken: string }
>
