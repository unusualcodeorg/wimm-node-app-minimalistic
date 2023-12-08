import Joi from 'joi';

export default {
  moods: Joi.array()
    .min(1)
    .required()
    .items(
      Joi.object().keys({
        id: Joi.number().required(),
        code: Joi.string().required().min(1).max(50),
        createdAt: Joi.date().iso().required(),
      }),
    ),
  journals: Joi.array()
    .min(1)
    .required()
    .items(
      Joi.object().keys({
        id: Joi.number().required(),
        text: Joi.string().required().min(1).max(10000),
        createdAt: Joi.date().iso().required(),
      }),
    ),
};
