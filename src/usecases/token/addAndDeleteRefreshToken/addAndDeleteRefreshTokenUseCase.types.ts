import { FailedToCreateError } from "../../../entities/errors"

export type AddNewRefreshTokenProps = {
  refreshToken: string
  userId: number
  deviceId: string
}

export type AddNewRefreshTokenResult = Promise<FailedToCreateError | undefined>