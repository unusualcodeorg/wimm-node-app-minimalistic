import Joi from 'joi';

export default {
  profile: Joi.object().keys({
    name: Joi.string().required().min(1).max(200),
    profilePicUrl: Joi.string().required().uri().max(500),
    tagline: Joi.string().required().min(1).max(500),
    firebaseToken: Joi.string().required().min(1).max(1000),
  }),
};
