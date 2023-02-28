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
  updateMessageDeleteStatus,
  deleteSelectedMessage,
  allMessages,
} = require("../queries/chat/chatQueries");

// @desc		Create new Room
// @route		/api/chat
// @access	Private
const getMessages = asyncHandler(async (req, res) => {
  const { chatId } = req.body;
  console.log(req.user._id.toString());
  const messages = await allMessages(chatId, req.user._id.toString());
  if (messages) {
    res.status(200).json({
      messages,
      message: "All Messages Fetched SuccessFully",
    });
  } else {
    res.status(500);
    throw new Error("Server could not process the request");
  }
});

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
    const { _id, messageId, deleted } = req.body;
    const message = await findMessageById(_id, messageId);

    if (message) {
      if (
        message.deleted &&
        message.deletedBy.toString() != req.user._id.toString()
      ) {
        const deletedMessage = await deleteSelectedMessage(_id, messageId);
        if (deletedMessage)
          res.status(200).json({
            message: "Message Permantly deleted",
          });
      } else {
        const updatedMessageStatus = await updateMessageDeleteStatus(
          _id,
          messageId,
          deleted,
          req.user._id
        );
        if (updatedMessageStatus) {
          res.status(200).json({
            message: "Message Status Updated SuccessFully",
          });
        } else {
          res.status(400).json({
            message: "Message not Found!",
          });
        }
      }
    } else {
      res.status(400).json({
        message: "Message not Found!",
      });
    }
  } catch (error) {
    res.status(400);
    throw new Error("Server could not process the request");
  }
});

module.exports = {
  createChat,
  createMessage,
  blockChat,
  deleteMessage,
  getMessages,
};
