import Joi from "joi"

export const deleteNoteIdValidationSchema = Joi.object({
  globalNoteId: Joi.string().pattern(/(\w+)-(\w+)-(\w+)-(\w+)-(\w+)/).required(),
})
