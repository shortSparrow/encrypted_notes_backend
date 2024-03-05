import {
  BadRequestError,
  FailedToCreateError,
} from "../../../entities/errors"
import { JWK } from "../../../entities/jwk"

export type AddUserProps = {
  deviceId: string
  userId: number
  name?: string
  type?: string
  operationSystem?: string
  noteEncryptionPublicKey: JWK
}

type AddUserSuccess = {
  accessToken: string
  refreshToken: string
}

export type AddUserResponse = Promise<
  FailedToCreateError | BadRequestError | AddUserSuccess
>
