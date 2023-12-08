import express from 'express';
import { ProtectedRequest } from 'app-request';
import { SuccessMsgResponse } from '../../core/ApiResponse';
import asyncHandler from '../../helpers/asyncHandler';
import validator, { ValidationSource } from '../../helpers/validator';
import schema from './schema';
import role from '../../helpers/role';
import authentication from '../../auth/authentication';
import authorization from '../../auth/authorization';
import { RoleCode } from '../../database/model/Role';
import processSubscription from './processor';

const router = express.Router();

/*----------------------------------------------------------------*/
router.use(authentication, role(RoleCode.VIEWER), authorization);
/*----------------------------------------------------------------*/

router.post(
  '/subscribe',
  validator(schema.subscribe, ValidationSource.BODY),
  asyncHandler(async (req: ProtectedRequest, res) => {
    await processSubscription(
      req.user,
      req.body.mentorIds,
      req.body.topicIds,
      'SUBSCRIBE',
    );
    new SuccessMsgResponse('Followed Successfully').send(res);
  }),
);

router.post(
  '/unsubscribe',
  validator(schema.subscribe, ValidationSource.BODY),
  asyncHandler(async (req: ProtectedRequest, res) => {
    await processSubscription(
      req.user,
      req.body.mentorIds,
      req.body.topicIds,
      'UNSUBSCRIBE',
    );
    new SuccessMsgResponse('Followed Successfully').send(res);
  }),
);

export default router;
