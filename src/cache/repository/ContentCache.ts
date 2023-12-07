import { getJson, setJson } from '../query';
import { Types } from 'mongoose';
import { DynamicKey, getDynamicKey } from '../keys';
import { caching } from '../../config';
import { addMillisToCurrentDate } from '../../helpers/utils';
import Content from '../../database/model/Content';

function getKeyForId(contentId: Types.ObjectId) {
  return getDynamicKey(DynamicKey.CONTENT, contentId.toHexString());
}

async function save(content: Content) {
  return setJson(
    getKeyForId(content._id),
    { ...content },
    addMillisToCurrentDate(caching.contentCacheDuration),
  );
}

async function fetchById(contentId: Types.ObjectId) {
  return getJson<Content>(getKeyForId(contentId));
}

export default {
  save,
  fetchById,
};
