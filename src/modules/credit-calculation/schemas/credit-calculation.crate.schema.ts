import { ECreditSubject, EPaymentType } from '@prisma/client';
import * as Joi from 'joi';

export const CreditCalculationCreateSchema = Joi.object({
  title: Joi.string().optional().max(128),
  paymentType: Joi.string()
    .valid(...Object.values(EPaymentType))
    .optional()
    .default(EPaymentType.annuitent),
  subject: Joi.string()
    .valid(...Object.values(ECreditSubject))
    .optional()
    .default(ECreditSubject.payment),
  amount: Joi.number().optional().default(null),
  percent: Joi.number().optional().default(null),
  period: Joi.number().optional().default(null),
  payment: Joi.number().optional().default(null),
}).options({
  abortEarly: false,
  allowUnknown: true,
});
