import Joi from 'joi';

export default {
  message: Joi.object().keys({
    type: Joi.string().required().min(1),
    message: Joi.string().required().min(1).max(1000)
  }),
};
