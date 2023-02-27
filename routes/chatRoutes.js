const router = require("express").Router();

// Controller
const { createChat, createMessage } = require("../controller/chatController");

router.post("/", createChat);
router.post("/create/message", createMessage);

module.exports = router;
