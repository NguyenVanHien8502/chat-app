const User = require("../models/userModel");
const asyncHandler = require("express-async-handler");
const { generateToken } = require("../config/jwtToken");
const { generateRefreshToken } = require("../config/refreshToken");

const registerUser = asyncHandler(async (req, res) => {
  const { username, email } = req.body;
  try {
    const alreadyUsername = await User.findOne({ username: username });
    const alreadyEmail = await User.findOne({ email: email });
    if (alreadyUsername) {
      res.json({
        msg: "Username already exists",
        status: false,
      });
    } else if (alreadyEmail) {
      res.json({
        msg: "Email already exists",
        status: false,
      });
    } else {
      const newUser = await User.create(req.body);
      res.json({
        status: true,
        newUser,
      });
    }
  } catch (error) {
    throw new Error(error);
  }
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  try {
    const findUser = await User.findOne({ email: email });
    if (findUser && (await findUser.isMatchedPassword(password))) {
      const refreshToken = generateRefreshToken(findUser?._id);
      await User.findByIdAndUpdate(
        findUser._id,
        {
          refreshToken: refreshToken,
        },
        {
          new: true,
        }
      );
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        maxAge: 72 * 60 * 60 * 1000,
      });
      res.json({
        msg: "Login successfully",
        status: true,
        user: {
          _id: findUser?._id,
          username: findUser?.username,
          email: findUser?.email,
          isAvatarImageSet: findUser?.isAvatarImageSet,
          avatarImage: findUser?.avatarImage,
          token: generateToken(findUser?._id),
        },
      });
    } else {
      throw new Error("Invalid Credentials");
    }
  } catch (error) {
    throw new Error(error);
  }
});

const getAllUser = asyncHandler(async (req, res) => {
  try {
    const allUser = await User.find();
    res.json(allUser);
  } catch (error) {
    throw new Error(error);
  }
});

const getaUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const findUser = await User.findById(id);
    res.json(findUser);
  } catch (error) {
    throw new Error(error);
  }
});

const updateUser = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  try {
    const updatedUser = await User.findByIdAndUpdate(
      _id,
      {
        username: req?.body?.username,
        avatarImage: req?.body?.avatarImage,
      },
      {
        new: true,
      }
    );
    res.json({
      msg: "Update successfullly",
      status: true,
      updatedUser: updatedUser,
    });
  } catch (error) {}
});

const deleteUser = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  try {
    const deletedUser = await User.findByIdAndDelete(_id);
    res.json({
      msg: "Delete successfully",
      status: true,
      deteledUser: deletedUser,
    });
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = {
  registerUser,
  loginUser,
  getAllUser,
  getaUser,
  updateUser,
  deleteUser,
};
