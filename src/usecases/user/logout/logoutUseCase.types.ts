import { UnexpectedError } from "../../../entities/errors"

export type LogoutResponse = Promise<UnexpectedError | boolean>
