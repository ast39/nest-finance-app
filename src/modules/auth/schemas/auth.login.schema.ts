import * as Joi from 'joi';

export const AuthLoginSchema = Joi.object({
  email: Joi.string().email().required().max(128),
  password: Joi.string().required().max(128),
});
