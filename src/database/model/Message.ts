import { Schema, model, Types } from 'mongoose';
import User from './User';

export const DOCUMENT_NAME = 'Message';
export const COLLECTION_NAME = 'messages';

export default interface Message {
  _id: Types.ObjectId;
  type: string;
  user: User;
  deviceId: string;
  message: string;
  receivedAt?: Date;
}

const schema = new Schema<Message>(
  {
    type: {
      type: Schema.Types.String,
      required: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    deviceId: {
      type: Schema.Types.String,
    },
    message: {
      type: Schema.Types.String,
      required: true,
    },
    receivedAt: {
      type: Schema.Types.Date,
      required: true,
      select: false,
    },
  },
  {
    versionKey: false,
  },
);

export const MessageModel = model<Message>(
  DOCUMENT_NAME,
  schema,
  COLLECTION_NAME,
);
