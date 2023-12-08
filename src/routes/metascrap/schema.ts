import Joi from 'joi';

export default {
  url: Joi.object().keys({
    url: Joi.string().uri().required().max(1000),
  }),
};
