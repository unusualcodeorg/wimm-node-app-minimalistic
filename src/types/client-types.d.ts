import { Types } from 'mongoose';
import { Category as ContentCategory } from '../database/model/Content';

declare type SubscriptionInfo = {
  itemId: Types.ObjectId;
  category: ContentCategory;
  subscribed: boolean;
};

declare type UniversalSearchResult = {
  id: Types.ObjectId;
  title: string;
  category: ContentCategory;
  thumbnail: string;
  extra: string;
};
