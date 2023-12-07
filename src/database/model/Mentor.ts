import { Schema, model, Types } from 'mongoose';
import User from './User';

export const DOCUMENT_NAME = 'Mentor';
export const COLLECTION_NAME = 'mentors';

export default interface Mentor {
  _id: Types.ObjectId;
  name: string;
  thumbnail: string;
  occupation: string;
  title: string;
  description: string;
  coverImgUrl: string;
  score: number;
  status?: boolean;
  createdBy?: User;
  updatedBy?: User;
  createdAt?: Date;
  updatedAt?: Date;
}

const schema = new Schema<Mentor>(
  {
    name: {
      type: Schema.Types.String,
      required: true,
      maxlength: 50,
      trim: true,
    },
    thumbnail: {
      type: Schema.Types.String,
      required: true,
      maxlength: 300,
      trim: true,
    },
    occupation: {
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
      select: false,
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
      type: Date,
      required: true,
      select: false,
    },
    updatedAt: {
      type: Date,
      required: true,
      select: false,
    },
  },
  {
    versionKey: false,
  },
);

schema.index(
  { name: 'text', occupation: 'text', title: 'text' },
  { weights: { name: 5, occupation: 1, title: 2 }, background: false },
);

export const MentorModel = model<Mentor>(
  DOCUMENT_NAME,
  schema,
  COLLECTION_NAME,
);
