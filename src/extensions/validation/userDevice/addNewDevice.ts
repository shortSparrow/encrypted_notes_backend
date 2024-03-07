import Joi from "joi"

// TODO add error messages
export const userDeviceValidationSchema = Joi.object({
  deviceId: Joi.string().max(50).required(),
  name: Joi.string().max(50),
  type: Joi.string().alphanum(),
  operationSystem: Joi.string().alphanum(),
  noteEncryptionPublicKey: Joi.object({
    crv: Joi.string().valid("X25519").error(new Error("Invalid public key")),
    kty: Joi.string().valid("OKP").error(new Error("Invalid public key")),
    x: Joi.string()
      .required()
      .error(new Error("Invalid public key")),
  }).required(),
})
