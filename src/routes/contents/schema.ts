import Joi from 'joi';
import { JoiObjectId } from '../../helpers/validator';

export default {
  id: Joi.object().keys({
    id: JoiObjectId().required(),
  }),
  pagination: Joi.object().keys({
    pageNumber: Joi.number().required().integer().min(1),
    pageItemCount: Joi.number().required().integer().min(1),
  }),
  rotatedPagination: Joi.object().keys({
    empty: Joi.boolean().required(),
    pageNumber: Joi.number().required().integer().min(1),
    pageItemCount: Joi.number().required().integer().min(1),
  }),
};
