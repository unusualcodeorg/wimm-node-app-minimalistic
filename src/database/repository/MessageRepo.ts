import Message, { MessageModel } from '../model/Message';

async function create(message: Message): Promise<Message> {
  const now = new Date();
  message.receivedAt = now;
  const created = await MessageModel.create(message);
  return created.toObject();
}

export default {
  create,
};
