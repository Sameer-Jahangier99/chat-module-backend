const asyncHandler = require("express-async-handler");
const socket = require("../server");

// Validation Schemas
const {
  createRoomSchema,
  createMessageSchema,
} = require("../validationSchema/chat");

// Queries
const {
  findChatRoom,
  insertMessageIntoChat,
  createChatRoom,
  getLastMessage,
  updateChatRoomBlockStatus,
  findMessageById,
} = require("../queries/chat/chatQueries");

// @desc		Create new Room
// @route		/api/chat
// @access	Private
const createChat = asyncHandler(async (req, res) => {
  const { error, value } = await createRoomSchema.validate(req.body, {
    abortEarly: false,
  });

  if (error) {
    return res.status(422).json({ error: error.details });
  }

  const { sender, reciever } = value;
  const newRoom = await createChatRoom(sender, reciever);
  if (newRoom) {
    res.status(200).json({
      room: {
        sender: newRoom.sender,
        reciever: newRoom.reciever,
      },
      message: "Room created successfully",
    });
  } else {
    res.status(500);
    throw new Error("Server could not process the request");
  }
});

// @desc		Create new Message
// @route		/api/chat/create/meesage
// @access	private
const createMessage = asyncHandler(async (req, res) => {
  const { error, value } = await createMessageSchema.validate(req.body, {
    abortEarly: false,
  });

  if (error) {
    return res.status(422).json({ error: error.details });
  }
  const { _id, sender, reciever, message } = value;

  const chatRoom = await findChatRoom(_id);

  if (chatRoom) {
    const newMessage = await insertMessageIntoChat(
      _id,
      sender,
      reciever,
      message
    );

    if (newMessage) {
      const recentMessage = await getLastMessage(_id);
      if (recentMessage) {
        socket.ioObject.sockets.emit(
          "new-message",
          recentMessage[0]?.messages[0]
        );
        res.status(200).json({
          message: {
            message: newMessage.message,
            reciever: newMessage.reciever,
            sender: newMessage.sender,
          },
          message: "Message Created Successfully",
        });
      }
    } else {
      res.status(500);
      throw new Error("Server could not process the request");
    }
  } else {
    res.status(500);
    throw new Error("Server could not process the request");
  }
});

// @desc Block Chat
// @route		/api/chat/block
// @access	private
const blockChat = asyncHandler(async (req, res) => {
  const { _id, isBlocked } = req.body;
  const chatRoom = await findChatRoom(_id);
  if (chatRoom) {
    try {
      const updateChatRoom = await updateChatRoomBlockStatus(_id, isBlocked);
      if (updateChatRoom) {
        res.status(200).json({
          message: "Room Status has been updated successfully",
        });
      }
    } catch (error) {
      res.status(400);
      throw new Error("Server could not process the request");
    }
  } else {
    res.status(400);
    throw new Error("Server could not process the request");
  }
});

// @desc Delete Message
// @route		/api/chat/delete/message
// @access	private
const deleteMessage = asyncHandler(async (req, res) => {
  try {
    const { _id, messageId } = req.body;
    const message = await findMessageById(_id, messageId);
    if (message) {
      const isDeleteMessagePermantly =
        message.deleted && message.deletedBy !== req.user._id;
      if (isDeleteMessagePermantly) {
        const isMessageDeleted = deleteMessage(_id, messageId);
        if (isMessageDeleted.nModified === 0) {
          res.status(400);
          throw new Error("Message not found or user not authorized.");
        }

        res.status(200).json({
          message: "Message Deleted SuccessFully",
        });
      }
    } else {
    }
  } catch (error) {
    res.status(400);
    throw new Error("Server could not process the request");
  }
});

module.exports = { createChat, createMessage, blockChat, deleteMessage };
