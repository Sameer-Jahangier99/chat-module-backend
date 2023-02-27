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
} = require("../queries/chat/chatQueries");

// @desc		Create new Room
// @route		/api/chat
// @access		Public
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

// @desc		Create new Room
// @route		/api/chat/create/meesage
// @access		Public
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
      res.status(200).json({
        message: {
          message: newMessage.message,
          reciever: newMessage.reciever,
          sender: newMessage.sender,
        },
        message: "Message Created Successfully",
      });
    } else {
      res.status(500);
      throw new Error("Server could not process the request");
    }
  } else {
    res.status(500);
    throw new Error("Server could not process the request");
  }
});

module.exports = { createChat, createMessage };
