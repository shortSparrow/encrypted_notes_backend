import { UnexpectedError } from "../../../entities/errors"
import { UserDeviceResponse } from "../../../entities/userDevice"

export type GetAllUserDevicesResponse = Promise<
  UnexpectedError | UserDeviceResponse[]
>
