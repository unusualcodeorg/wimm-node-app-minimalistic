import Topic, { TopicModel } from '../model/Topic';
import { Types } from 'mongoose';

const INFO_PARAMETERS = '-description -status';

async function findById(id: Types.ObjectId): Promise<Topic | null> {
  return TopicModel.findOne({ _id: id, status: true }).lean().exec();
}

async function create(topic: Topic): Promise<Topic> {
  const now = new Date();
  topic.createdAt = now;
  topic.updatedAt = now;
  const created = await TopicModel.create(topic);
  return created.toObject();
}

async function update(topic: Topic): Promise<Topic | null> {
  topic.updatedAt = new Date();
  return TopicModel.findByIdAndUpdate(topic._id, topic, { new: true })
    .lean()
    .exec();
}

async function findTopicsPaginated(
  pageNumber: number,
  limit: number,
): Promise<Topic[]> {
  return TopicModel.find({ status: true })
    .skip(limit * (pageNumber - 1))
    .limit(limit)
    .select(INFO_PARAMETERS)
    .sort({ updatedAt: -1 })
    .lean()
    .exec();
}

async function findByIds(ids: [Types.ObjectId]): Promise<Topic[]> {
  return TopicModel.find()
    .where('_id')
    .in(ids)
    .select(INFO_PARAMETERS)
    .lean()
    .exec();
}

async function search(query: string, limit: number): Promise<Topic[]> {
  return TopicModel.find({
    $text: { $search: query, $caseSensitive: false },
    status: true,
  })
    .select(INFO_PARAMETERS)
    .limit(limit)
    .lean()
    .exec();
}

async function searchLike(query: string, limit: number): Promise<Topic[]> {
  return TopicModel.find()
    .and([
      { status: true },
      {
        $or: [
          { name: { $regex: `.*${query}.*`, $options: 'i' } },
          { title: { $regex: `.*${query}.*`, $options: 'i' } },
        ],
      },
    ])
    .select(INFO_PARAMETERS)
    .limit(limit)
    .lean()
    .exec();
}

async function findRecommendedTopics(limit: number): Promise<Topic[]> {
  return TopicModel.find({ status: true })
    .limit(limit)
    .select(INFO_PARAMETERS)
    .sort({ score: -1 })
    .lean()
    .exec();
}

async function findRecommendedTopicsPaginated(
  pageNumber: number,
  limit: number,
): Promise<Topic[]> {
  return TopicModel.find({ status: true })
    .skip(limit * (pageNumber - 1))
    .limit(limit)
    .select(INFO_PARAMETERS)
    .sort({ score: -1 })
    .lean()
    .exec();
}

export default {
  findById,
  create,
  update,
  findTopicsPaginated,
  findByIds,
  search,
  searchLike,
  findRecommendedTopics,
  findRecommendedTopicsPaginated,
};
