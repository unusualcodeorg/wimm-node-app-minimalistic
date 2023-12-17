import Joi from 'joi';

export default {
  image: Joi.object().keys({
    image: Joi.string().required(),
  }),
};
