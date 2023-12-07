import Subscription, { SubscriptionModel } from '../model/Subscription';
import { Types } from 'mongoose';
import User from '../model/User';
import Topic from '../model/Topic';

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
  return SubscriptionModel.findOne({ user: user._id, status: true })
    .populate('topics')
    .populate('mentors')
    .lean()
    .exec();
}

async function findSubscribedMentors(user: User): Promise<Subscription | null> {
  return SubscriptionModel.findOne({ user: user._id, status: true })
    .select('-status -topics -user')
    .populate('mentors', 'name thumbnail occupation title coverImgUrl')
    .lean()
    .exec();
}

async function findSubscribedTopics(user: User): Promise<Subscription | null> {
  return SubscriptionModel.findOne({ user: user._id, status: true })
    .select('-status -mentors -user')
    .populate('topics', 'name thumbnail title coverImgUrl')
    .lean()
    .exec();
}

async function findSubscribedSingleMentor(
  user: User,
  mentorId: Types.ObjectId,
): Promise<Subscription | null> {
  return SubscriptionModel.findOne({
    user: user._id,
    status: true,
    mentors: mentorId,
  })
    .select('-status -mentors -topics -user')
    .lean()
    .exec();
}

async function findSubscribedSingleTopic(
  user: User,
  topic: Topic,
): Promise<Subscription | null> {
  return SubscriptionModel.findOne({
    user: user._id,
    status: true,
    topics: topic._id,
  })
    .select('-status -mentors -topics -user')
    .lean()
    .exec();
}

export default {
  findById,
  create,
  update,
  findSubscriptionForUser,
  findSubscribedMentors,
  findSubscribedTopics,
  findSubscribedSingleMentor,
  findSubscribedSingleTopic,
};
