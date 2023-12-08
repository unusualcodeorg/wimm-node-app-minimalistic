import Joi from 'joi';
import { JoiObjectId } from '../../helpers/validator';

export default {
  id: Joi.object().keys({
    id: JoiObjectId().required(),
  }),
  contentId: Joi.object().keys({
    contentId: JoiObjectId().required(),
  }),
};
