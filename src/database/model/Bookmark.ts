import { Schema, model, Types } from 'mongoose';
import User from './User';
import Content from './Content';

export const DOCUMENT_NAME = 'Bookmark';
export const COLLECTION_NAME = 'bookmarks';

export default interface Bookmark {
  _id: Types.ObjectId;
  user: User;
  content: Content;
  status?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

const schema = new Schema<Bookmark>(
  {
    user: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'User',
      index: true,
    },
    content: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'Content',
      index: true,
    },
    status: {
      type: Schema.Types.Boolean,
      default: true,
    },
    createdAt: {
      type: Schema.Types.Date,
      required: true,
      select: false,
    },
    updatedAt: {
      type: Schema.Types.Date,
      required: true,
      select: false,
    },
  },
  {
    versionKey: false,
  },
);

export const BookmarkModel = model<Bookmark>(
  DOCUMENT_NAME,
  schema,
  COLLECTION_NAME,
);
