import {
  BadRequestError,
  FailedToCreateError,
  NotFoundError,
  UnauthorizedError,
  UnexpectedError,
} from "../../../entities/errors"
import { JWK } from "../../../entities/jwk";

export type LoginSuccessResponse = { accessToken: string; refreshToken: string }
export type LoginUserProps = {
  phone: string
  password: string
  deviceId: string
  noteEncryptionPublicKey: JWK
}

export type LoginUserResponse = Promise<
  | NotFoundError
  | BadRequestError
  | UnauthorizedError
  | UnexpectedError
  | FailedToCreateError
  | LoginSuccessResponse
>
