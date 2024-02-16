import Joi from "joi"

// TODO add error messages
export const userDeviceValidationSchema = Joi.object({
  deviceId: Joi.string().max(50),
  name: Joi.string().alphanum(),
  type: Joi.string().alphanum(),
  operationSystem: Joi.string().alphanum(),
})
