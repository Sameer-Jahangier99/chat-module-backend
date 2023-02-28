// Models
const Chat = require("../../models/Chat");

const findChatRoom = async (_id) => await Chat.findById(_id);

const createChatRoom = async (sender = "", reciever = "") =>
  Chat.create({
    sender,
    reciever,
  });

const insertMessageIntoChat = async (
  _id = "",
  sender = "",
  reciever = "",
  message = ""
) => {
  return await Chat.updateOne(
    {
      _id,
    },
    {
      $push: {
        messages: {
          sender,
          reciever,
          message,
        },
      },
    }
  );
};

const getLastMessage = async (_id) =>
  await Chat.find({ _id }, { messages: { $slice: -1 } });

const updateChatRoomBlockStatus = async (_id, isBlocked) =>
  await Chat.findOneAndUpdate({ _id }, { $set: { isBlocked: isBlocked } });

const findMessageById = async (_id, messageId) =>
  await Chat.findOne({
    _id,
    messages: { $elemMatch: { _id: messageId } },
  });

const deleteMessage = async (_id, messageId) =>
  await Chat.updateOne({ _id }, { $pull: { messages: { _id: messageId } } });

const updateMessageDeleteStatus = async (_id, messageId) =>
  await Chat.updateOne(
    { _id, "messages._id": messageId },
    {
      $set: {
        "OrderItems.$.imgUrl": imgUrl[0],

      },
    },
    { upsert: false }
  );

module.exports = {
  findChatRoom,
  insertMessageIntoChat,
  createChatRoom,
  getLastMessage,
  updateChatRoomBlockStatus,
  findMessageById,
  deleteMessage,
};
