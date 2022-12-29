const { errbody, respbody } = require("../helper/generateResponse");
const { User } = require("../models/userModel");
const { Chat, MessageModel } = require("../models/chatModel");

module.exports = {
  CreateChat: async (req, res) => {
    const { senderId, receiverId } = req.body;
    const newChat = new Chat({
      members: [senderId, receiverId],
    });
    try {
      let chatExist = await Chat.findOne({
        members: { $all: [senderId, receiverId] },
      });
      if (!chatExist) {
        const result = await newChat.save();
        return respbody(res, result);
      }
      return respbody(res, "chat already exist");
    } catch (error) {
      return errbody(res, error.message);
    }
  },
  userChats: async (req, res) => {
    const { userId } = req.params;
    try {
      const chat = await Chat.find({
        members: { $in: [userId] },
      });
      return respbody(res, chat);
    } catch (error) {
      return errbody(res, error.message);
    }
  },
  findChat: async (req, res) => {
    try {
      const { firstId, secondId } = req.params;
      const chat = await Chat.findOne({
        members: { $all: [firstId, secondId] },
      });
      return respbody(res, chat);
    } catch (error) {
      return errbody(res, error.message);
    }
  },
  addMessage: async (req, res) => {
    const { chatId, senderId, text } = req.body;
    const message = new MessageModel({
      chatId,
      senderId,
      text,
    });
    try {
      const result = await message.save();
      return respbody(res, result);
    } catch (error) {
      return errbody(res, error.message);
    }
  },
  getMessages: async (req, res) => {
    const { chatId } = req.params;
    try {
      const result = await MessageModel.find({ chatId });
      return respbody(res, result);
    } catch (error) {
      return errbody(res, error.message);
    }
  },
};
