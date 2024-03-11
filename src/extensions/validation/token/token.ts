import Joi from "joi"
import { AuthToken } from "../../../.."

export const tokenValidationSchema = Joi.object<AuthToken>({
  userId: Joi.number().greater(0),
  deviceId: Joi.string().not().empty(),
}).unknown(true)
