import Joi from 'joi';
import { Category } from '../../database/model/Content';

export default {
  searchKey: Joi.object().keys({
    query: Joi.string().required().min(1).max(300),
    filter: Joi.string()
      .valid(...Object.values(Category))
      .optional(),
  }),
};
