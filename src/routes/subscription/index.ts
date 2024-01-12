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
import { SubscriptionInfo } from '../../types/client-types';
import { Category } from '../../database/model/Content';
import MentorRepo from '../../database/repository/MentorRepo';
import TopicRepo from '../../database/repository/TopicRepo';

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
    new SuccessMsgResponse('Unfollowed Successfully').send(res);
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
      category: Category.MENTOR_INFO,
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
      category: Category.TOPIC_INFO,
      subscribed: exits,
    };

    new SuccessResponse('Success', data).send(res);
  }),
);

router.get(
  '/recommendation/mentors',
  validator(schema.pagination, ValidationSource.QUERY),
  asyncHandler(async (req: ProtectedRequest, res) => {
    const mentors = await MentorRepo.findRecommendedMentorsPaginated(
      parseInt(req.query.pageNumber as string),
      parseInt(req.query.pageItemCount as string),
    );

    const data = mentors.map((m) => ({ ...m, subscribed: false }));

    const subscription = await SubscriptionRepo.findSubscribedMentors(req.user);

    if (subscription) {
      for (const entry of data) {
        const found = subscription.mentors.find((m) => m._id.equals(entry._id));
        if (found) entry.subscribed = true;
      }
    }

    new SuccessResponse('Success', data).send(res);
  }),
);

router.get(
  '/recommendation/topics',
  validator(schema.pagination, ValidationSource.QUERY),
  asyncHandler(async (req: ProtectedRequest, res) => {
    const topics = await TopicRepo.findRecommendedTopicsPaginated(
      parseInt(req.query.pageNumber as string),
      parseInt(req.query.pageItemCount as string),
    );

    const data = topics.map((t) => ({ ...t, subscribed: false }));

    const subscription = await SubscriptionRepo.findSubscribedTopics(req.user);

    if (subscription) {
      for (const entry of data) {
        const found = subscription.topics.find((m) => m._id.equals(entry._id));
        if (found) entry.subscribed = true;
      }
    }

    new SuccessResponse('Success', data).send(res);
  }),
);

export default router;
