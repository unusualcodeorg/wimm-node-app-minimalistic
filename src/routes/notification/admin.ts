import express from 'express';
import { SuccessResponse } from '../../core/ApiResponse';
import { ProtectedRequest } from 'app-request';
import validator from '../../helpers/validator';
import { sendNotificationToSingle, sendNotificationToTopic } from '../../helpers/firebase';
import schema from './schema';
import asyncHandler from '../../helpers/asyncHandler';
import authentication from '../../auth/authentication';
import authorization from '../../auth/authorization';
import role from '../../helpers/role';
import { RoleCode } from '../../database/model/Role';
import { notifSetting } from '../../config';

const router = express.Router();

/*-------------------------------------------------------------------------*/
router.use(authentication, role(RoleCode.ADMIN), authorization);
/*-------------------------------------------------------------------------*/

router.post(
  '/user',
  validator(schema.notificationSingleAdmin),
  asyncHandler(async (req: ProtectedRequest, res) => {
    const result = await sendNotificationToSingle(
      { ...req.body.data },
      req.body.firebaseFcmToken,
      notifSetting.dryrun,
    );
    return new SuccessResponse('Notification Send Success', result).send(res);
  }),
);

router.post(
  '/topic',
  validator(schema.notificationTopicAdmin),
  asyncHandler(async (req: ProtectedRequest, res) => {
    const result = await sendNotificationToTopic(
      { ...req.body.data },
      req.body.topic,
      notifSetting.dryrun,
    );
    return new SuccessResponse('Notification Send Success', result).send(res);
  }),
);

export default router;
