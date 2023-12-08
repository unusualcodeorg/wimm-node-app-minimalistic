import Subscription, { SubscriptionModel } from '../model/Subscription';
import { Types } from 'mongoose';
import User from '../model/User';

async function findById(id: Types.ObjectId): Promise<Subscription | null> {
  return SubscriptionModel.findOne({ _id: id, status: true })
    .populate('topics')
    .populate('mentors')
    .lean()
    .exec();
}

async function create(
  subscription: Subscription,
): Promise<Subscription | null> {
  const now = new Date();
  subscription.createdAt = now;
  subscription.updatedAt = now;
  const created = await SubscriptionModel.create(subscription);
  return created.toObject();
}

async function update(
  subscription: Subscription,
): Promise<Subscription | null> {
  subscription.updatedAt = new Date();
  return SubscriptionModel.findByIdAndUpdate(subscription._id, subscription, {
    new: true,
  })
    .lean()
    .exec();
}

async function findSubscriptionForUser(
  user: User,
): Promise<Subscription | null> {
  return SubscriptionModel.findOne({ user: user, status: true })
    .lean()
    .exec();
}

async function findSubscriptionForUserPopulated(
  user: User,
): Promise<Subscription | null> {
  return SubscriptionModel.findOne({ user: user, status: true })
    .populate({
      path: 'mentors',
      match: { status: true },
      select: 'name thumbnail occupation title coverImgUrl',
    })
    .populate({
      path: 'topics',
      match: { status: true },
      select: 'name thumbnail title coverImgUrl',
    })
    .lean()
    .exec();
}

async function findSubscribedMentors(user: User): Promise<Subscription | null> {
  return SubscriptionModel.findOne({ user: user, status: true })
    .select('-status -topics -user')
    .populate({
      path: 'mentors',
      match: { status: true },
      select: 'name thumbnail occupation title coverImgUrl',
    })
    .lean()
    .exec();
}

async function findSubscribedTopics(user: User): Promise<Subscription | null> {
  return SubscriptionModel.findOne({ user: user, status: true })
    .select('-status -mentors -user')
    .populate({
      path: 'topics',
      match: { status: true },
      select: 'name thumbnail title coverImgUrl',
    })
    .lean()
    .exec();
}

async function mentorSubscriptionExists(
  user: User,
  mentorId: Types.ObjectId,
): Promise<boolean> {
  const subscription = await SubscriptionModel.exists({
    user: user,
    mentors: mentorId,
    status: true,
  });
  return subscription !== null && subscription !== undefined;
}

async function topicSubscriptionExists(
  user: User,
  topicId: Types.ObjectId,
): Promise<boolean> {
  const subscription = await SubscriptionModel.exists({
    user: user,
    topics: topicId,
    status: true,
  });
  return subscription !== null && subscription !== undefined;
}

export default {
  findById,
  create,
  update,
  findSubscriptionForUser,
  findSubscriptionForUserPopulated,
  findSubscribedMentors,
  findSubscribedTopics,
  mentorSubscriptionExists,
  topicSubscriptionExists,
};
