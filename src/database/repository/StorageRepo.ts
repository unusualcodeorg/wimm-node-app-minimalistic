import Storage, { StorageModel } from '../model/Storage';

async function insertMany(storages: Storage[]): Promise<Storage[]> {
  return StorageModel.insertMany(storages);
}

export default {
  insertMany,
};
