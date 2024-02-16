import { FailedToCreateError } from "../../entities/errors"

export type ResetAllRefreshTokensForDeviceProps = {
  userId: number
  deviceId: string
}

export type AddNewRefreshTokenProps = {
  refreshToken: string
  userId: number
  deviceId: string
}
