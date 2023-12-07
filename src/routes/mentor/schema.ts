import Joi from 'joi';
import { JoiObjectId } from '../../helpers/validator';

export default {
  id: Joi.object().keys({
    id: JoiObjectId().required(),
  }),
  mentorCreate: Joi.object().keys({
    name: Joi.string().required().min(3).max(50),
    thumbnail: Joi.string().required().uri().max(300),
    occupation: Joi.string().required().min(3).max(50),
    title: Joi.string().required().min(3).max(300),
    description: Joi.string().required().min(3).max(10000),
    coverImgUrl: Joi.string().required().uri().max(300),
    score: Joi.number().optional().min(0).max(1),
  }),
  mentorUpdate: Joi.object().keys({
    name: Joi.string().optional().min(3).max(50),
    thumbnail: Joi.string().optional().uri().max(300),
    occupation: Joi.string().optional().min(3).max(50),
    title: Joi.string().optional().min(3).max(300),
    description: Joi.string().optional().min(3).max(10000),
    coverImgUrl: Joi.string().optional().uri().max(300),
    score: Joi.number().optional().min(0).max(1),
  }),
};
