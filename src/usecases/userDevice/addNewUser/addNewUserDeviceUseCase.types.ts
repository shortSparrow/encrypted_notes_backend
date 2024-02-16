import {
  BadRequestError,
  FailedToCreateError,
} from "../../../entities/errors"

export type AddUserProps = {
  deviceId: string
  userId: number
  name?: string
  type?: string
  operationSystem?: string
}

type AddUserSuccess = {
  accessToken: string
  refreshToken: string
}

export type AddUserResponse = Promise<
  FailedToCreateError | BadRequestError | AddUserSuccess
>
