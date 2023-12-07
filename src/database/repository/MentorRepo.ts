import Mentor, { MentorModel } from '../model/Mentor';
import { Types } from 'mongoose';

const INFO_PARAMETERS = '-description -status';

async function findById(id: Types.ObjectId): Promise<Mentor | null> {
  return MentorModel.findOne({ _id: id, status: true }).lean().exec();
}

async function create(mentor: Mentor): Promise<Mentor> {
  const now = new Date();
  mentor.createdAt = now;
  mentor.updatedAt = now;
  const created = await MentorModel.create(mentor);
  return created.toObject();
}

async function update(mentor: Mentor): Promise<Mentor | null> {
  mentor.updatedAt = new Date();
  return MentorModel.findByIdAndUpdate(mentor._id, mentor, { new: true })
    .lean()
    .exec();
}

async function findMentorsPaginated(
  pageNumber: number,
  limit: number,
): Promise<Mentor[]> {
  return MentorModel.find({ status: true })
    .skip(limit * (pageNumber - 1))
    .limit(limit)
    .select(INFO_PARAMETERS)
    .sort({ updatedAt: -1 })
    .lean()
    .exec();
}

async function findByIds(ids: [Types.ObjectId]): Promise<Mentor[]> {
  return MentorModel.find()
    .where('_id')
    .in(ids)
    .select(INFO_PARAMETERS)
    .lean()
    .exec();
}

async function search(query: string, limit: number): Promise<Mentor[]> {
  return MentorModel.find({
    $text: { $search: query, $caseSensitive: false },
    status: true,
  })
    .select(INFO_PARAMETERS)
    .limit(limit)
    .lean()
    .exec();
}

async function searchLike(query: string, limit: number): Promise<Mentor[]> {
  return MentorModel.find()
    .and([
      { status: true },
      {
        $or: [
          { name: { $regex: `.*${query}.*`, $options: 'i' } },
          { occupation: { $regex: `.*${query}.*`, $options: 'i' } },
          { title: { $regex: `.*${query}.*`, $options: 'i' } },
        ],
      },
    ])
    .select(INFO_PARAMETERS)
    .limit(limit)
    .lean()
    .exec();
}

async function findRecommendedMentors(limit: number): Promise<Mentor[]> {
  return MentorModel.find({ status: true })
    .limit(limit)
    .select(INFO_PARAMETERS)
    .sort({ score: -1 })
    .lean()
    .exec();
}

async function findRecommendedMentorsPaginated(
  pageNumber: number,
  limit: number,
): Promise<Mentor[]> {
  return MentorModel.find({ status: true })
    .skip(limit * (pageNumber - 1))
    .limit(limit)
    .select(INFO_PARAMETERS)
    .sort({ score: -1 })
    .lean()
    .exec();
}

async function remove(topic: Mentor): Promise<Mentor | null> {
  topic.updatedAt = new Date();
  topic.status = false;
  return MentorModel.findByIdAndUpdate(
    topic._id,
    { $set: { status: false } },
    { new: true },
  )
    .lean()
    .exec();
}

export default {
  findById,
  create,
  update,
  findMentorsPaginated,
  findByIds,
  search,
  searchLike,
  findRecommendedMentors,
  findRecommendedMentorsPaginated,
  remove,
};
