import Bookmark, { BookmarkModel } from '../model/Bookmark';
import { Types } from 'mongoose';
import User from '../model/User';
import Content from '../model/Content';

async function findById(id: Types.ObjectId): Promise<Bookmark | null> {
  return BookmarkModel.findOne({ _id: id, status: true })
    .populate('user', 'status')
    .populate('content', 'status private')
    .lean()
    .exec();
}

async function create(sample: Bookmark): Promise<Bookmark> {
  const now = new Date();
  sample.createdAt = now;
  sample.updatedAt = now;
  const created = await BookmarkModel.create(sample);
  return created.toObject();
}

async function update(sample: Bookmark): Promise<Bookmark | null> {
  sample.updatedAt = new Date();
  return BookmarkModel.findByIdAndUpdate(sample._id, sample, { new: true })
    .lean()
    .exec();
}

async function findBookmark(
  user: User,
  content: Content,
): Promise<Bookmark | null> {
  return BookmarkModel.findOne({
    user: user._id,
    content: content._id,
    status: true,
  })
    .populate('user', 'status')
    .populate('content', 'status private')
    .lean()
    .exec();
}

async function findBookmarks(user: User): Promise<Bookmark[]> {
  return BookmarkModel.find({ user: user._id, status: true })
    .sort({ createdAt: -1 })
    .lean()
    .exec();
}

async function removeBookmark(bookmark: Bookmark): Promise<any> {
  return BookmarkModel.updateOne(
    { _id: bookmark._id },
    { $set: { status: false } },
  )
    .lean()
    .exec();
}

export default {
  findById,
  create,
  update,
  findBookmark,
  findBookmarks,
  removeBookmark,
};
