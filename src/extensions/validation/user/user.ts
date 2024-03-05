import Joi from "joi"
import { passwordRegex, phoneRegex } from "../baseScheme"

export const registerValidationSchema = Joi.object({
  password: Joi.string()
    .pattern(passwordRegex)
    .message("Password is wrong")
    .required(),
  phone: Joi.string()
    .regex(phoneRegex)
    .messages({ "string.pattern.base": `Phone number must have 10 digits.` })
    .required(),
})

export const loginValidationSchema = Joi.object({
  deviceId: Joi.string().max(50),
  password: Joi.string()
    .pattern(passwordRegex)
    .message("Password is wrong")
    .required(),
  phone: Joi.string()
    .regex(phoneRegex)
    .messages({ "string.pattern.base": `Phone number must have 10 digits.` })
    .required(),

  noteEncryptionPublicKey: Joi.object({
    crv: Joi.string().valid("X25519").error(new Error("Invalid public key")),
    kty: Joi.string().valid("OKP").error(new Error("Invalid public key")),
    x: Joi.string()
      .alphanum()
      .required()
      .error(new Error("Invalid public key")),
  }).required(),
})
