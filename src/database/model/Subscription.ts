import { Schema, model, Types } from 'mongoose';
import User from './User';
import Topic from './Topic';
import Mentor from './Mentor';

export const DOCUMENT_NAME = 'Subscription';
export const COLLECTION_NAME = 'subscriptions';

export default interface Subscription {
  _id: Types.ObjectId;
  user: User;
  topics: Topic[];
  mentors: Mentor[];
  status?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

const schema = new Schema<Subscription>(
  {
    user: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'User',
      unique: true,
      index: true,
    },
    topics: [
      new Schema({
        type: Schema.Types.ObjectId,
        ref: 'Topic',
      }),
    ],
    mentors: [
      new Schema({
        type: Schema.Types.ObjectId,
        ref: 'Mentor',
      }),
    ],
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

export const SubscriptionModel = model<Subscription>(
  DOCUMENT_NAME,
  schema,
  COLLECTION_NAME,
);
