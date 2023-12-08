import Joi from 'joi';
import { JoiObjectId } from '../../helpers/validator';
import { Category } from '../../database/model/Content';

export default {
  id: Joi.object().keys({
    id: JoiObjectId().required(),
  }),
  contentId: Joi.object().keys({
    contentId: JoiObjectId().required(),
  }),
  contentCreate: Joi.object().keys({
    category: Joi.string()
      .valid(...Object.values(Category))
      .required(),
    title: Joi.string().required().min(3).max(300),
    subtitle: Joi.string().required().min(3).max(100),
    thumbnail: Joi.string().uri().required().max(300),
    extra: Joi.string().required().min(1).max(300),
    description: Joi.string().optional().min(1).max(1000),
  }),
  contentAdminCreate: Joi.object().keys({
    category: Joi.string()
      .valid(...Object.values(Category))
      .required(),
    topicId: JoiObjectId().optional(),
    mentorId: JoiObjectId().optional(),
    title: Joi.string().required().min(3).max(300),
    subtitle: Joi.string().required().min(3).max(100),
    thumbnail: Joi.string().uri().required().max(300),
    extra: Joi.string().required().min(1).max(300),
    description: Joi.string().optional().min(1).max(1000),
    score: Joi.number().optional().min(0).max(1),
  }),
};
