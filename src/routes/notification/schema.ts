import Joi from 'joi';
import { Variant } from './utils';
import { JoiObjectId } from '../../helpers/validator';

export default {
  notificationSingle: Joi.object().keys({
    firebaseFcmToken: Joi.string().min(1).max(500).required(),
    type: Joi.string()
      .valid(...Object.values(Variant))
      .required(),
    ticker: Joi.string().min(1).max(50).required(),
    title: Joi.string().min(1).max(200).required(),
    subtitle: Joi.string().min(1).max(200).required(),
    message: Joi.string().min(1).max(500).required(),
    thumbnail: Joi.string().uri().required(),
    action: Joi.string().min(1).max(500).optional(),
    resource: Joi.string().min(1).max(800).optional(),
  }),
  notificationTopic: Joi.object().keys({
    topic: Joi.string().min(1).max(200).required(),
    type: Joi.string()
      .valid(...Object.values(Variant))
      .required(),
    ticker: Joi.string().min(1).max(50).required(),
    title: Joi.string().min(1).max(200).required(),
    subtitle: Joi.string().min(1).max(200).required(),
    message: Joi.string().min(1).max(500).required(),
    thumbnail: Joi.string().uri().required(),
    action: Joi.string().min(1).max(500).optional(),
    resource: Joi.string().min(1).max(800).optional(),
  }),
  notificationMultiUsers: Joi.object().keys({
    type: Joi.string()
      .valid(...Object.values(Variant))
      .required(),
    ticker: Joi.string().min(1).max(50).required(),
    title: Joi.string().min(1).max(200).required(),
    subtitle: Joi.string().min(1).max(200).optional(),
    message: Joi.string().min(1).max(500).optional(),
    thumbnail: Joi.string().uri().optional(),
    users: Joi.array().min(1).max(1000).required().items(JoiObjectId().required()),
    action: Joi.string().min(1).max(500).optional(),
    resource: Joi.string().min(1).max(800).optional(),
  }),
  notificationRegister: Joi.object().keys({
    firebaseFcmToken: Joi.string().min(1).max(500).required(),
  }),
  notificationTopicAdmin: Joi.object().keys({
    topic: Joi.string().min(1).max(200).required(),
    data: Joi.object().required().unknown(true),
  }),
  notificationSingleAdmin: Joi.object().keys({
    firebaseFcmToken: Joi.string().min(1).max(500).required(),
    data: Joi.object().required().unknown(true),
  }),
  notificationBotUsers: Joi.object().keys({
    count: Joi.number().integer().min(1).max(1000).required(),
  }),
};
