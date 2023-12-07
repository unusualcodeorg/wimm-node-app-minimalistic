import { Schema, model, Types } from 'mongoose';
import User from './User';

export const DOCUMENT_NAME = 'Topic';
export const COLLECTION_NAME = 'topics';

export default interface Topic {
  _id: Types.ObjectId;
  name: string;
  title: string;
  thumbnail: string;
  description: string;
  coverImgUrl: string;
  score: number;
  status?: boolean;
  createdBy?: User;
  updatedBy?: User;
  createdAt?: Date;
  updatedAt?: Date;
}

const schema = new Schema<Topic>(
  {
    name: {
      type: Schema.Types.String,
      required: true,
      maxlength: 50,
      trim: true,
    },
    title: {
      type: Schema.Types.String,
      required: true,
      maxlength: 300,
      trim: true,
    },
    thumbnail: {
      type: Schema.Types.String,
      required: true,
      maxlength: 300,
      trim: true,
    },
    description: {
      type: Schema.Types.String,
      required: true,
      maxlength: 10000,
      trim: true,
    },
    coverImgUrl: {
      type: Schema.Types.String,
      required: true,
      maxlength: 300,
      trim: true,
    },
    score: {
      type: Schema.Types.Number,
      default: 0.01,
      max: 1,
      min: 0,
    },
    status: {
      type: Schema.Types.Boolean,
      default: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      select: false,
      index: true,
    },
    updatedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      select: false,
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

schema.index(
  { name: 'text', title: 'text' },
  { weights: { name: 3, title: 1 }, background: false },
);

export const TopicModel = model<Topic>(
  DOCUMENT_NAME,
  schema,
  COLLECTION_NAME,
);
