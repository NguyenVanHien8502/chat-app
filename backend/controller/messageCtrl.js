const Message = require("../models/MessageModel");
const User = require("../models/userModel");
const asyncHandler = require("express-async-handler");

const addMsg = asyncHandler(async (req, res) => {
  try {
    const { _id } = req.user;
    const { message, receiver } = req.body;
    const currentUser = await User.findById(_id);
    const addMsg = await Message.create({
      message: message,
      sender: currentUser?._id,
      receiver: receiver,
    });
    if (addMsg) {
      res.json({
        msg: "Message is sent successfully",
        status: true,
        message: addMsg,
      });
    } else {
      res.json({
        msg: "Message is sent fail, please try again.",
        status: false,
      });
    }
  } catch (error) {
    throw new Error(error);
  }
});

const getAllMsg = asyncHandler(async (req, res) => {
  try {
    const { _id } = req.user;
    const { opponent } = req.body;
    const currentUser = await User.findById(_id);
    const allMsg = await Message.find({
      $or: [
        { sender: currentUser?._id, receiver: opponent },
        { sender: opponent, receiver: currentUser?._id },
      ],
    }).sort({ updatedAt: 1 }); //updatedAt:1 là sắp xếp tăng dần, -1 là sắp xếp nhỏ dần
    res.json(allMsg);
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = { addMsg, getAllMsg };
