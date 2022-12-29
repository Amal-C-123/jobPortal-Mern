const express = require("express");
const {
  CreateChat,
  userChats,
  findChat,
  addMessage,
  getMessages,
} = require("../controllers/chatController");
const { verifyToken } = require("../middlewares/Auth");
const router = express.Router();

router.post("/", CreateChat);
router.get("/:userId", userChats);
router.get("/find/:firstId/:secondId", findChat);
router.post("/message", addMessage);
router.get("/message/:chatId", getMessages);

module.exports = router;
