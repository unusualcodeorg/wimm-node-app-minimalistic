import Joi from 'joi';

export default {
  asset: Joi.object().keys({
    'content-type': Joi.string().required(),
  }),
};
