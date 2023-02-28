const router = require("express").Router();

// Controllers
const {
  createChat,
  createMessage,
  blockChat,
} = require("../controller/chatController");

router.post("/", createChat);
router.post("/create/message", createMessage);
router.patch("/block", blockChat);

module.exports = router;
