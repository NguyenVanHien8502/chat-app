const User = require("../models/userModel");
const asyncHandler = require("express-async-handler");
const { generateToken } = require("../config/jwtToken");
const { generateRefreshToken } = require("../config/refreshToken");
const jwt = require("jsonwebtoken");

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
          avatar: findUser?.avatar,
          token: generateToken(findUser?._id),
          refreshToken: refreshToken,
        },
      });
    } else {
      res.json({
        msg: "Invalid Credentials",
        status: false,
      });
    }
  } catch (error) {
    throw new Error(error);
  }
});

const handleRefreshToken = asyncHandler(async (req, res) => {
  const cookie = req.cookies;
  if (!cookie?.refreshToken) throw new Error("No Refresh Token in cookies");
  const refreshToken = cookie.refreshToken;
  const user = await User.findOne({ refreshToken: refreshToken });
  if (!user)
    throw new Error("No Refresh Token present in database or not matched");
  jwt.verify(refreshToken, process.env.JWT_SECRET, (err, decoded) => {
    if (err || user?.id !== decoded?.id)
      throw new Error("There is something error with refresh token");
    const newToken = generateToken(user?._id);
    res.json(newToken);
  });
});

const getAllUser = asyncHandler(async (req, res) => {
  try {
    const { _id } = req.user;
    const allUser = await User.find();
    const allUserExceptMe = await allUser.filter(
      (user) => user._id.toString() !== _id.toString()
    );
    res.json(allUserExceptMe);
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

const logout = asyncHandler(async (req, res) => {
  const cookie = req.cookies;
  const { _id } = req.user;
  try {
    if (!cookie?.refreshToken) throw new Error("No Refresh Token in Cookies");
    const refreshToken = cookie.refreshToken;
    const currentUser = await User.findOne({
      refreshToken: refreshToken,
      _id: _id,
    });
    if (!currentUser) {
      res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: true,
      });
      res.json({
        msg: "RefreshToken and _id not matched for user",
        status: true,
      });
    }
    await User.findOneAndUpdate(
      {
        refreshToken: refreshToken,
      },
      {
        refreshToken: "",
      },
      {
        new: true,
      }
    );
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: true,
    });
    res.json({
      msg: "Logout successfully",
      status: true,
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
  logout,
  handleRefreshToken,
};
