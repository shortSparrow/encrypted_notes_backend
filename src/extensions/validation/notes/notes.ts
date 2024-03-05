import Joi from "joi"

const buteArraySchema = Joi.array()
  .min(1)
  .items(Joi.number().min(0).max(255))
  .required() // maybe just use binary

const itemSchema = Joi.object({
  data: Joi.object({
    title: {
      cipherText: buteArraySchema,
      nonce: buteArraySchema,
      mac: buteArraySchema,
    },
    message: {
      cipherText: buteArraySchema,
      nonce: buteArraySchema,
      mac: buteArraySchema,
    },
  }).required(),
  metaData: Joi.object({
    createdAt: Joi.date().timestamp().required(),
    updatedAt: Joi.date().timestamp().required(),
    sendToDeviceId: Joi.string().required(),
    noteGlobalId: Joi.optional(), // "globalId" can't exist before note created
  }).required(),
})

export const createNoteValidationSchema = Joi.array()
  .items(itemSchema)
  .min(1)
  .required()
