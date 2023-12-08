import express from 'express';
import { ProtectedRequest } from 'app-request';
import { SuccessMsgResponse, SuccessResponse } from '../../core/ApiResponse';
import asyncHandler from '../../helpers/asyncHandler';
import validator, { ValidationSource } from '../../helpers/validator';
import schema from './schema';
import role from '../../helpers/role';
import authentication from '../../auth/authentication';
import authorization from '../../auth/authorization';
import { RoleCode } from '../../database/model/Role';
import processSubscription from './processor';
import SubscriptionRepo from '../../database/repository/SubscriptionRepo';
import { NotFoundError } from '../../core/ApiError';
import { Types } from 'mongoose';
import { SubscriptionInfo } from '../../types/model-types';
import { Category } from '../../database/model/Content';

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

router.get(
  '/mentors',
  asyncHandler(async (req: ProtectedRequest, res) => {
    const subscription = await SubscriptionRepo.findSubscribedMentors(req.user);
    if (!subscription)
      throw new NotFoundError('You have not subscribed to any Mentor');
    new SuccessResponse('Success', subscription.mentors).send(res);
  }),
);

router.get(
  '/topics',
  asyncHandler(async (req: ProtectedRequest, res) => {
    const subscription = await SubscriptionRepo.findSubscribedTopics(req.user);
    if (!subscription)
      throw new NotFoundError('You have not subscribed to any Topic');
    new SuccessResponse('Success', subscription.topics).send(res);
  }),
);

router.get(
  '/info/mentor/:id',
  validator(schema.id, ValidationSource.PARAM),
  asyncHandler(async (req: ProtectedRequest, res) => {
    const mentorId = new Types.ObjectId(req.params.id);
    const exits = await SubscriptionRepo.mentorSubscriptionExists(
      req.user,
      mentorId,
    );

    const data: SubscriptionInfo = {
      itemId: mentorId,
      contentType: Category.MENTOR_INFO,
      subscribed: exits,
    };

    new SuccessResponse('Success', data).send(res);
  }),
);

router.get(
  '/info/topic/:id',
  validator(schema.id, ValidationSource.PARAM),
  asyncHandler(async (req: ProtectedRequest, res) => {
    const topicId = new Types.ObjectId(req.params.id);
    const exits = await SubscriptionRepo.topicSubscriptionExists(
      req.user,
      topicId,
    );

    const data: SubscriptionInfo = {
      itemId: topicId,
      contentType: Category.TOPIC_INFO,
      subscribed: exits,
    };

    new SuccessResponse('Success', data).send(res);
  }),
);

export default router;
