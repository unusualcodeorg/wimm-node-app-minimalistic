import Joi from 'joi';
import { JoiObjectId } from '../../helpers/validator';

export default {
  subscribe: Joi.object().keys({
    mentorIds: Joi.array().optional().items(JoiObjectId().required()),
    topicIds: Joi.array().optional().items(JoiObjectId().required()),
  }),
};
