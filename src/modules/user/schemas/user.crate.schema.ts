import { EUserStatus } from '@prisma/client';
import * as Joi from 'joi';

export const UserCreateSchema = Joi.object({
  email: Joi.string().email().required().max(128),
  password: Joi.string().optional().max(128),
  name: Joi.string().required().max(128),
  status: Joi.string()
    .valid(...Object.values(EUserStatus))
    .optional()
    .default(EUserStatus.active),
}).options({
  abortEarly: false,
  allowUnknown: true,
});
