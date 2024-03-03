import Joi from "joi"

const buteArraySchema = Joi.array().items(Joi.number().min(0).max(255)).required() // maybe just use binary
// const buteArraySchema = Joi.binary().required() // maybe just use binary

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
  }),
  metaData: Joi.object({
    createdAt: Joi.date().timestamp().required(),
    updatedAt: Joi.date().timestamp().required(),
    sendToDeviceId: Joi.string().required(),
    globalId: Joi.valid(null), // "globalId" can't exist before note created
  }),
})

export const createNoteValidationSchema = Joi.array()
  .items(itemSchema)
  .required()
