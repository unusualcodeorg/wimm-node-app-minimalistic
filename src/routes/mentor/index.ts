import express from 'express';
import { ProtectedRequest } from 'app-request';
import { SuccessResponse } from '../../core/ApiResponse';
import asyncHandler from '../../helpers/asyncHandler';
import validator, { ValidationSource } from '../../helpers/validator';
import schema from './schema';
import role from '../../helpers/role';
import authentication from '../../auth/authentication';
import authorization from '../../auth/authorization';
import { RoleCode } from '../../database/model/Role';
import { Types } from 'mongoose';
import { NotFoundError } from '../../core/ApiError';
import SubscriptionRepo from '../../database/repository/SubscriptionRepo';
import admin from './admin';
import MentorRepo from '../../database/repository/MentorRepo';

const router = express.Router();

router.use('/admin', admin);

/*-------------------------------------------------------------------------*/
router.use(authentication, role(RoleCode.VIEWER), authorization);
/*-------------------------------------------------------------------------*/

router.get(
  '/id/:id',
  validator(schema.id, ValidationSource.PARAM),
  asyncHandler(async (req: ProtectedRequest, res) => {
    const mentor = await MentorRepo.findById(new Types.ObjectId(req.params.id));
    if (!mentor) throw new NotFoundError('Mentor not found');

    const subscription = await SubscriptionRepo.findSubscriptionForUser(
      req.user,
    );

    // TODO: check if the m._id exists
    const subscribedTopic = subscription?.topics.find((m) =>
      mentor._id.equals(m._id),
    );

    const data = { ...mentor, subscribed: subscribedTopic !== undefined };
    new SuccessResponse('Success', data).send(res);
  }),
);

export default router;
