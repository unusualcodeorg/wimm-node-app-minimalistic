import express from 'express';
import authentication from '../../auth/authentication';
import { RoleCode } from '../../database/model/Role';
import role from '../../helpers/role';
import authorization from '../../auth/authorization';
import validator from '../../helpers/validator';
import asyncHandler from '../../helpers/asyncHandler';
import { ProtectedRequest } from '../../types/app-request';
import {
  NotificationData,
  sendNotificationToMulti,
  sendNotificationToSingle,
  sendNotificationToTopic,
} from '../../helpers/firebase';
import schema from './schema';
import { notifSetting } from '../../config';
import { SuccessResponse } from '../../core/ApiResponse';
import UserRepo from '../../database/repository/UserRepo';
import { Types } from 'mongoose';
import { BadRequestError } from '../../core/ApiError';

const router = express.Router();

/*-------------------------------------------------------------------------*/
router.use(
  authentication,
  role(RoleCode.ADMIN, RoleCode.MANAGER),
  authorization,
);
/*-------------------------------------------------------------------------*/

router.post(
  '/user',
  validator(schema.notificationSingle),
  asyncHandler(async (req: ProtectedRequest, res) => {
    const data = {
      type: req.body.type,
      ticker: req.body.ticker,
      title: req.body.title,
      subtitle: req.body.subtitle,
      message: req.body.message,
      thumbnail: req.body.thumbnail,
      date: new Date().toISOString(),
    } as NotificationData;

    if (req.body.action) data.action = req.body.action;
    if (req.body.resource) data.resource = req.body.resource;

    const result = await sendNotificationToSingle(
      data,
      req.body.firebaseFcmToken,
      notifSetting.dryrun,
    );

    return new SuccessResponse('Notification Send Success', result).send(res);
  }),
);

router.post(
  '/topic',
  validator(schema.notificationTopic),
  asyncHandler(async (req: ProtectedRequest, res) => {
    const data = {
      type: req.body.type,
      ticker: req.body.ticker,
      title: req.body.title,
      subtitle: req.body.subtitle,
      message: req.body.message,
      thumbnail: req.body.thumbnail,
      date: new Date().toISOString(),
    } as NotificationData;

    if (req.body.action) data.action = req.body.action;
    if (req.body.resource) data.resource = req.body.resource;

    const result = await sendNotificationToTopic(
      data,
      req.body.topic,
      notifSetting.dryrun,
    );

    return new SuccessResponse('Notification Send Success', result).send(res);
  }),
);

router.post(
  '/multi/users',
  validator(schema.notificationMultiUsers),
  asyncHandler(async (req: ProtectedRequest, res) => {
    const users = await UserRepo.findFieldsByIds(
      req.body.users.map((id: string) => new Types.ObjectId(id)),
      'firebaseFcmToken',
    );

    const tokens: string[] = [];
    users.forEach((user) => {
      if (user.firebaseFcmToken) tokens.push(user.firebaseFcmToken);
    });

    if (tokens.length === 0)
      throw new BadRequestError('No user has active firebase tokens');

    const data = {
      type: req.body.type,
      ticker: req.body.ticker,
      title: req.body.title,
      subtitle: req.body.subtitle ? req.body.subtitle : '',
      message: req.body.message ? req.body.message : '',
      thumbnail: req.body.thumbnail ? req.body.thumbnail : '',
      date: new Date().toISOString(),
    } as NotificationData;

    if (req.body.action) data.action = req.body.action;
    if (req.body.resource) data.resource = req.body.resource;

    const result = await sendNotificationToMulti(
      data,
      tokens,
      notifSetting.dryrun,
    );

    return new SuccessResponse('Notification Send Success', result).send(res);
  }),
);

export default router;
