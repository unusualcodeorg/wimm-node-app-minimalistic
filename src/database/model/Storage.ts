import { Schema, model, Types } from 'mongoose';
import User from './User';

export const DOCUMENT_NAME = 'Storage';
export const COLLECTION_NAME = 'storages';

export default interface Storage {
  _id: Types.ObjectId;
  id: number;
  data1: string;
  data2?: string;
  data3?: string;
  status?: boolean;
  createdBy: User;
  updatedBy: User;
  createdAt?: Date;
  updatedAt?: Date;
}

const schema = new Schema<Storage>(
  {
    id: {
      type: Schema.Types.Number,
      default: 0,
      min: 0,
    },
    data1: {
      type: Schema.Types.String,
      maxlength: 2000,
      trim: true,
    },
    data2: {
      type: Schema.Types.String,
      maxlength: 2000,
      trim: true,
    },
    data3: {
      type: Schema.Types.String,
      maxlength: 2000,
      trim: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'User',
      index: true,
    },
    updatedBy: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'User',
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

export const StorageModel = model<Storage>(
  DOCUMENT_NAME,
  schema,
  COLLECTION_NAME,
);
