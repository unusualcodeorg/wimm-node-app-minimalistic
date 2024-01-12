import { Schema, model, Types } from 'mongoose';
import Topic from './Topic';
import Mentor from './Mentor';
import User from './User';

export const DOCUMENT_NAME = 'Content';
export const COLLECTION_NAME = 'contents';

export enum Category {
  AUDIO = 'AUDIO',
  VIDEO = 'VIDEO',
  IMAGE = 'IMAGE',
  YOUTUBE = 'YOUTUBE',
  ARTICLE = 'ARTICLE',
  QUOTE = 'QUOTE',
  MENTOR_INFO = 'MENTOR_INFO',
  TOPIC_INFO = 'TOPIC_INFO',
}

export default interface Content {
  _id: Types.ObjectId;
  category: Category;
  title: string;
  subtitle: string;
  description?: string;
  thumbnail: string;
  extra: string;
  topics: Topic[];
  mentors: Mentor[];
  likedBy: User[];
  likes: number;
  liked?: boolean; // temporary variable for the API to send if user liked or not
  views: number;
  shares: number;
  general?: boolean;
  score: number;
  private?: boolean;
  submit?: boolean;
  status?: boolean;
  createdBy: User;
  updatedBy?: User;
  createdAt?: Date;
  updatedAt?: Date;
}

const schema = new Schema<Content>(
  {
    category: {
      type: Schema.Types.String,
      required: true,
      enum: Object.values(Category),
    },
    title: {
      type: Schema.Types.String,
      required: true,
      maxlength: 300,
      trim: true,
    },
    subtitle: {
      type: Schema.Types.String,
      required: true,
      maxlength: 100,
      trim: true,
    },
    description: {
      type: Schema.Types.String,
      required: false,
      select: false,
      maxlength: 2000,
      trim: true,
    },
    thumbnail: {
      type: Schema.Types.String,
      required: true,
      maxlength: 300,
      trim: true,
    },
    extra: {
      type: Schema.Types.String,
      required: true,
      maxlength: 300,
      trim: true,
    },
    topics: {
      type: [
        {
          type: Schema.Types.ObjectId,
          ref: 'Topic',
        },
      ],
      select: false,
      index: true,
    },
    mentors: {
      type: [
        {
          type: Schema.Types.ObjectId,
          ref: 'Mentor',
        },
      ],
      select: false,
      index: true,
    },
    likedBy: {
      type: [
        {
          type: Schema.Types.ObjectId,
          ref: 'User',
        },
      ],
      select: false,
      index: true,
    },
    likes: {
      type: Schema.Types.Number,
      default: 0,
      min: 0,
    },
    views: {
      type: Schema.Types.Number,
      default: 0,
      min: 0,
    },
    shares: {
      type: Schema.Types.Number,
      default: 0,
      min: 0,
    },
    general: {
      type: Schema.Types.Boolean,
      default: true,
      select: false,
    },
    score: {
      type: Schema.Types.Number,
      default: 0.01,
      max: 1,
      min: 0,
    },
    private: {
      type: Schema.Types.Boolean,
      default: false,
    },
    submit: {
      type: Schema.Types.Boolean,
      default: false,
      select: false,
    },
    status: {
      type: Schema.Types.Boolean,
      default: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
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
  { title: 'text', subtitle: 'text' },
  { weights: { title: 3, subtitle: 1 }, background: false },
);

export const ContentModel = model<Content>(
  DOCUMENT_NAME,
  schema,
  COLLECTION_NAME,
);
