import Joi from 'joi';
import { JoiObjectId } from '../../helpers/validator';

export default {
  id: Joi.object().keys({
    id: JoiObjectId().required(),
  }),
  subscribe: Joi.object().keys({
    mentorIds: Joi.array().optional().items(JoiObjectId().required()),
    topicIds: Joi.array().optional().items(JoiObjectId().required()),
  }),
  pagination: Joi.object().keys({
    pageNumber: Joi.number().required().integer().min(1),
    pageItemCount: Joi.number().required().integer().min(1),
  }),
};
