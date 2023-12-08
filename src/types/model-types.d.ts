import { Types } from 'mongoose';
import { Category as ContentCategory } from '../database/model/Content';

declare type Mood = {
  id: number;
  code: string;
  createdAt: Date;
};

declare type Journal = {
  id: number;
  text: string;
  createdAt: Date;
};

declare type SubscriptionInfo = {
  itemId: Types.ObjectId;
  contentCategory: ContentCategory;
  subscribed: boolean;
};
