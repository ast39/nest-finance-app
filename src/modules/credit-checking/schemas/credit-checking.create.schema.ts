import * as Joi from 'joi';

export const CreditCheckingCreateSchema = Joi.object({
  title: Joi.string().optional().max(128),
  amount: Joi.number().optional().default(null),
  percent: Joi.number().optional().default(null),
  period: Joi.number().optional().default(null),
  payment: Joi.number().optional().default(null),
}).options({
  abortEarly: false,
  allowUnknown: true,
});
