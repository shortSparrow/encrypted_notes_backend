import Joi from "joi"

// TODO add error messages
export const userDeviceValidationSchema = Joi.object({
  deviceId: Joi.string().max(50).required(),
  name: Joi.string().max(50),
  type: Joi.string().alphanum(),
  operationSystem: Joi.string().alphanum(),
})
