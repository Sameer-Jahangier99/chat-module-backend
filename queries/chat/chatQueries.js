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

module.exports = { findChatRoom, insertMessageIntoChat, createChatRoom };
