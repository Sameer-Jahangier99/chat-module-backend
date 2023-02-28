const express = require("express");
const router = express.Router()

// Controllers
const {
  createChat,
  createMessage,
  blockChat,
  deleteMessage,
  getMessages,
} = require("../controller/chatController");

// Middlewares
const auth = require('../middleware/authMiddleware');

router.route("/").post(createChat).get(getMessages);
router.route("/delete/message").patch(auth, deleteMessage);
router.route('/block').patch(blockChat);
router.post("/create/message", createMessage);

module.exports = router;
