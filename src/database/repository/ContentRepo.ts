import Content, { Category, ContentModel } from '../model/Content';
import { Types } from 'mongoose';
import Subscription from '../model/Subscription';
import User from '../model/User';

async function findById(id: Types.ObjectId): Promise<Content | null> {
  return ContentModel.findOne({ _id: id, status: true }).lean().exec();
}

async function create(content: Content): Promise<Content> {
  const now = new Date();
  content.createdAt = now;
  content.updatedAt = now;
  const created = await ContentModel.create(content);
  return created.toObject();
}

async function update(content: Content): Promise<Content | null> {
  content.updatedAt = new Date();
  return ContentModel.findByIdAndUpdate(content._id, content, { new: true })
    .lean()
    .exec();
}

async function remove(content: Content): Promise<Content | null> {
  content.updatedAt = new Date();
  content.status = false;
  return ContentModel.findByIdAndUpdate(
    content._id,
    { $set: { status: false } },
    { new: true },
  )
    .lean()
    .exec();
}

async function findByIdPopulated(id: Types.ObjectId): Promise<Content | null> {
  return ContentModel.findById(id)
    .select('+mentors +topics')
    .populate({
      path: 'createdBy',
      match: { status: true },
      select: '_id',
    })
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

async function findPublicInfoById(id: Types.ObjectId): Promise<Content | null> {
  return ContentModel.findOne({ _id: id, status: true, private: { $ne: true } })
    .select('-status -private')
    .populate({
      path: 'createdBy',
      match: { status: true },
      select: '_id name profilePicUrl',
    })
    .lean()
    .exec();
}

async function findContentsPaginated(
  pageNumber: number,
  limit: number,
): Promise<Content[]> {
  return ContentModel.find({ status: true, private: { $ne: true } })
    .select('-status -private')
    .populate({
      path: 'createdBy',
      match: { status: true },
      select: '_id name profilePicUrl',
    })
    .skip(limit * (pageNumber - 1))
    .limit(limit)
    .sort({ updatedAt: -1 })
    .lean()
    .exec();
}

async function findMentorContentsPaginated(
  mentorId: Types.ObjectId,
  pageNumber: number,
  limit: number,
): Promise<Content[]> {
  return ContentModel.find({
    mentors: mentorId,
    status: true,
    private: { $ne: true },
  })
    .select('-status -private')
    .populate({
      path: 'createdBy',
      match: { status: true },
      select: '_id',
    })
    .skip(limit * (pageNumber - 1))
    .limit(limit)
    .sort({ score: -1, updatedAt: -1 })
    .lean()
    .exec();
}

async function findTopicContentsPaginated(
  topicId: Types.ObjectId,
  pageNumber: number,
  limit: number,
): Promise<Content[]> {
  return ContentModel.find({
    topics: topicId,
    status: true,
    private: { $ne: true },
  })
    .select('-status -private')
    .populate({
      path: 'createdBy',
      match: { status: true },
      select: '_id',
    })
    .skip(limit * (pageNumber - 1))
    .limit(limit)
    .sort({ score: -1, updatedAt: -1 })
    .lean()
    .exec();
}

async function search(query: string, limit: number): Promise<Content[]> {
  return ContentModel.find({
    $text: { $search: query, $caseSensitive: false },
    status: true,
    private: { $ne: true },
  })
    .select('-status -private')
    .populate({
      path: 'createdBy',
      match: { status: true },
      select: '_id',
    })
    .limit(limit)
    .sort({ score: -1, updatedAt: -1 })
    .lean()
    .exec();
}

async function searchLike(query: string, limit: number): Promise<Content[]> {
  return ContentModel.find({
    title: { $regex: `.*${query}.*`, $options: 'i' },
    status: true,
    private: { $ne: true },
  })
    .select('-status -private')
    .populate({
      path: 'createdBy',
      match: { status: true },
      select: '_id',
    })
    .limit(limit)
    .sort({ score: -1, updatedAt: -1 })
    .lean()
    .exec();
}

async function searchSimilar(
  contentId: Types.ObjectId,
  cetegory: Category,
  query: string,
  limit: number,
): Promise<Content[]> {
  return ContentModel.find(
    {
      $text: { $search: query, $caseSensitive: false },
      status: true,
      private: { $ne: true },
      cetegory: cetegory,
      _id: { $ne: contentId },
    },
    {
      similarity: { $meta: 'textScore' },
    },
  )
    .select('-status -private')
    .populate({
      path: 'createdBy',
      match: { status: true },
      select: '_id name profilePicUrl',
    })
    .limit(limit)
    .sort({ similarity: { $meta: 'textScore' } })
    .lean()
    .exec();
}

async function findSubscriptionContentsPaginated(
  subscription: Subscription,
  pageNumber: number,
  limit: number,
): Promise<Content[]> {
  return ContentModel.find()
    .and([
      { status: true },
      { private: { $ne: true } },
      {
        $or: [
          { mentors: { $in: subscription.mentors } },
          { topics: { $in: subscription.topics } },
          { general: { $eq: true }, submit: true },
        ],
      },
    ])
    .select('-status -private')
    .populate({
      path: 'createdBy',
      match: { status: true },
      select: '_id name profilePicUrl',
    })
    .skip(limit * (pageNumber - 1))
    .limit(limit)
    .sort({ updatedAt: -1 })
    .lean()
    .exec();
}

async function findUserContentsPaginated(
  userId: Types.ObjectId,
  pageNumber: number,
  limit: number,
): Promise<Content[]> {
  return ContentModel.find({ createdBy: userId, status: true })
    .select('-status -private')
    .populate({
      path: 'createdBy',
      match: { status: true },
      select: '_id',
    })
    .skip(limit * (pageNumber - 1))
    .limit(limit)
    .sort({ updatedAt: -1 })
    .lean()
    .exec();
}

async function findUserBoxContentPaginated(
  userId: Types.ObjectId,
  bookmarkedContentIds: Types.ObjectId[],
  pageNumber: number,
  limit: number,
): Promise<Content[]> {
  return ContentModel.find()
    .and([
      { status: true },
      {
        $or: [{ createdBy: userId }, { _id: { $in: bookmarkedContentIds } }],
      },
    ])
    .select('-status +submit')
    .populate({
      path: 'createdBy',
      match: { status: true },
      select: '_id',
    })
    .skip(limit * (pageNumber - 1))
    .limit(limit)
    .sort({ createdAt: -1 })
    .lean()
    .exec();
}

async function findPrivateInfoById(
  id: Types.ObjectId,
): Promise<Content | null> {
  return ContentModel.findById(id)
    .select('+submit')
    .populate({
      path: 'createdBy',
      match: { status: true },
      select: '_id',
    })
    .lean()
    .exec();
}

async function addLikeForUser(
  content: Content,
  user: User,
  likes: number,
): Promise<Content | null> {
  return ContentModel.findByIdAndUpdate(
    content._id,
    { $push: { likedBy: user }, likes: likes },
    { new: true },
  )
    .lean()
    .exec();
}

async function removeLikeForUser(
  content: Content,
  user: User,
  likes: number,
): Promise<Content | null> {
  return ContentModel.findByIdAndUpdate(
    content._id,
    { $pull: { likedBy: user }, likes: likes },
    { new: true },
  )
    .lean()
    .exec();
}

async function findUserAndContentsLike(
  user: User,
  contentIds: Types.ObjectId[],
): Promise<Content[]> {
  return ContentModel.find({
    status: true,
    likedBy: user,
    _id: { $in: contentIds },
  })
    .select('-status -private')
    .lean()
    .exec();
}

async function findUserAndContentLike(
  user: User,
  contentId: Types.ObjectId,
): Promise<Content | null> {
  return ContentModel.findOne({ status: true, likedBy: user, _id: contentId })
    .select('-status -private')
    .lean()
    .exec();
}

export default {
  findById,
  create,
  update,
  remove,
  findByIdPopulated,
  findPublicInfoById,
  findContentsPaginated,
  findMentorContentsPaginated,
  findTopicContentsPaginated,
  search,
  searchLike,
  searchSimilar,
  findSubscriptionContentsPaginated,
  findUserContentsPaginated,
  findUserBoxContentPaginated,
  findPrivateInfoById,
  addLikeForUser,
  removeLikeForUser,
  findUserAndContentsLike,
  findUserAndContentLike,
};
