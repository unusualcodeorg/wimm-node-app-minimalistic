import { Types } from 'mongoose';
import User from '../../database/model/User';
import SubscriptionRepo from '../../database/repository/SubscriptionRepo';
import Subscription from '../../database/model/Subscription';
import { InternalError } from '../../core/ApiError';
import MentorRepo from '../../database/repository/MentorRepo';
import TopicRepo from '../../database/repository/TopicRepo';

export default async function processSubscription(
  user: User,
  mentorIds: Types.ObjectId[] | undefined,
  topicIds: Types.ObjectId[] | undefined,
  mode: 'SUBSCRIBE' | 'UNSUBSCRIBE',
) {
  let subscription = await SubscriptionRepo.findSubscriptionForUser(user);
  if (!subscription) {
    subscription = await SubscriptionRepo.create({
      user: user,
    } as Subscription);
  }

  if (!subscription) throw new InternalError();

  let modified = false;

  if (mentorIds && mentorIds.length > 0) {
    const mentors = await MentorRepo.findByIds(mentorIds);
    if (mentors.length > 0) {
      for (const mentor of mentors) {
        const found = subscription.mentors.find((m) =>
          m._id.equals(mentor._id),
        );
        switch (mode) {
          case 'SUBSCRIBE':
            if (!found) {
              subscription.mentors.unshift(mentor); // Can be optimized since we are increasing the list for search
              modified = true;
            }
            break;
          case 'UNSUBSCRIBE':
            if (found) {
              const index = subscription.mentors.indexOf(found);
              if (index != -1) subscription.mentors.splice(index, 1);
              modified = true;
            }
            break;
        }
      }
    }
  }

  if (topicIds && topicIds.length > 0) {
    const topics = await TopicRepo.findByIds(topicIds);
    if (topics.length > 0) {
      for (const topic of topics) {
        const found = subscription.topics.find((t) => t._id.equals(topic._id));
        switch (mode) {
          case 'SUBSCRIBE':
            if (!found) {
              subscription.topics.unshift(topic); // Can be optimized since we are increasing the list for search
              modified = true;
            }
            break;
          case 'UNSUBSCRIBE':
            if (found) {
              const index = subscription.topics.indexOf(found);
              if (index != -1) subscription.topics.splice(index, 1);
              modified = true;
            }
            break;
        }
      }
    }
  }

  if (!modified) return null;

  return await SubscriptionRepo.update(subscription);
}
