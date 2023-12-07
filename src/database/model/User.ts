import { model, Schema, Types } from 'mongoose';
import Role from './Role';

export const DOCUMENT_NAME = 'User';
export const COLLECTION_NAME = 'users';

export default interface User {
  _id: Types.ObjectId;
  name?: string;
  email?: string;
  deviceId?: string;
  password?: string;
  firebaseToken?: string;
  googleId?: string;
  facebookId?: string;
  profilePicUrl?: string;
  googleProfilePicUrl?: string;
  facebookProfilePicUrl?: string;
  tagline?: string;
  roles: Role[];
  verified?: boolean;
  status?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

const schema = new Schema<User>(
  {
    name: {
      type: Schema.Types.String,
      trim: true,
      maxlength: 200,
    },
    email: {
      type: Schema.Types.String,
      unique: true,
      sparse: true, // allows null
      trim: true,
      select: false,
    },
    deviceId: {
      type: Schema.Types.String,
      unique: true,
      required: true,
      sparse: true,
      trim: true,
    },
    password: {
      type: Schema.Types.String,
      select: false,
    },
    firebaseToken: {
      type: Schema.Types.String,
      select: false,
      trim: true,
    },
    googleId: {
      type: Schema.Types.String,
      select: false,
      trim: true,
    },
    facebookId: {
      type: Schema.Types.String,
      select: false,
      trim: true,
    },
    profilePicUrl: {
      type: Schema.Types.String,
      trim: true,
    },
    googleProfilePicUrl: {
      type: Schema.Types.String,
      trim: true,
    },
    facebookProfilePicUrl: {
      type: Schema.Types.String,
      trim: true,
    },
    tagline: {
      type: Schema.Types.String,
      trim: true,
    },
    roles: {
      type: [
        {
          type: Schema.Types.ObjectId,
          ref: 'Role',
        },
      ],
      required: true,
      select: false,
    },
    verified: {
      type: Schema.Types.Boolean,
      default: false,
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

schema.index({ _id: 1, status: 1 });
schema.index({ email: 1 });
schema.index({ status: 1 });

export const UserModel = model<User>(DOCUMENT_NAME, schema, COLLECTION_NAME);
