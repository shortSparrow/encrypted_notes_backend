import Joi from "joi"

const buteArraySchema = Joi.array()
  .min(1)
  .items(Joi.number().min(0).max(255))
  .required()

const data = Joi.object({
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
}).required()

const metadataAddNew = Joi.object({
  createdAt: Joi.date().timestamp().required(),
  updatedAt: Joi.date().timestamp().required(),
  sendToDeviceId: Joi.string().required(),
  noteGlobalId: Joi.any().valid(null).optional(), // "globalId" can't exist before note created
}).required()

export const createNoteValidationSchema = Joi.array()
  .items(
    Joi.object({
      data: data,
      metaData: metadataAddNew,
    })
  )
  .min(1)
  .required()

const itemSchemaEdit = Joi.object({
  data: data,
  metaData: metadataAddNew.keys({
    noteGlobalId: Joi.string().required(),
  }),
})

export const editNoteValidationSchema = Joi.array()
  .items(itemSchemaEdit)
  .min(1)
  .required()
