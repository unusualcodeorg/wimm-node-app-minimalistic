import Joi from 'joi';

export default {
  profile: Joi.object().keys({
    name: Joi.string().optional().min(1).max(200),
    profilePicUrl: Joi.string().optional().uri().max(500),
    tagline: Joi.string().optional().min(1).max(500),
  }),
};
