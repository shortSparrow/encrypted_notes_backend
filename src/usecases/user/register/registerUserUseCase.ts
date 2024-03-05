import { injectable } from "tsyringe"
import { hashPasswordSync } from "../../../utils/hashed/hashedPasswordSync"
import { UserRepository } from "../../../repositories/user.repository"
import {
  BadRequestError,
  ConflictError,
  FailedToCreateError,
  UnexpectedError,
} from "../../../entities/errors"
import {
  RegisterUserProps,
  RegisterUserResult,
} from "./registerUserUseCase.types"
import { registerValidationSchema } from "../../../extensions/validation/user/user"

@injectable()
export class RegisterUserUseCase {
  constructor(private _userRepository: UserRepository) {}

  private _isParamsValid = (props: RegisterUserProps) => {
    const { phone, password } = props
    const validationResult = registerValidationSchema.validate({
      password,
      phone,
    })

    if (validationResult.error) {
      return new BadRequestError(validationResult.error.message)
    }

    return true
  }

  registerUser = async (props: RegisterUserProps): RegisterUserResult => {
    try {
      const { phone, password } = props
      const validationResult = this._isParamsValid({ phone, password })
      if (validationResult instanceof BadRequestError) {
        return validationResult
      }

      const passwordHashed = hashPasswordSync(password)

      const user = await this._userRepository.getUserByPhone(phone)
      if (user) {
        return new ConflictError("User with this phone already exist")
      }

      const userId = await this._userRepository.createUser({
        phone,
        passwordHashed,
      })

      if (userId === null) {
        return new FailedToCreateError("Failed to create user")
      }

      return { id: userId }
    } catch (err) {
      // TODO handle different cases

      console.log("Error: ", err)
      return new UnexpectedError(`Unknown error: ${err}`)
    }
  }
}
