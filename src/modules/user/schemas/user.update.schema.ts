import { EUserStatus } from '@prisma/client';
import * as Joi from 'joi';

export const UserUpdateSchema = Joi.object({
  email: Joi.string().email().optional().max(128),
  password: Joi.string().optional().max(128),
  name: Joi.string().optional().max(128),
  status: Joi.string()
    .valid(...Object.values(EUserStatus))
    .optional(),
}).options({
  abortEarly: false,
  allowUnknown: true,
});
