import {
  BadRequestError,
  FailedToCreateError,
  NotFoundError,
  UnauthorizedError,
  UnknownError,
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
  | UnknownError
  | FailedToCreateError
  | LoginSuccessResponse
>
