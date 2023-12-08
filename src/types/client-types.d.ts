import { Types } from 'mongoose';
import { Category as ContentCategory } from '../database/model/Content';

declare type SubscriptionInfo = {
  itemId: Types.ObjectId;
  contentType: ContentCategory;
  subscribed: boolean;
};

declare type UniversalSearchResult = {
  id: Types.ObjectId;
  title: string;
  contentType: ContentCategory;
  thumbnail: string;
  extra: string;
};
