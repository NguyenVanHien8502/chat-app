const User = require("../models/userModel");
const asyncHandler = require("express-async-handler");

const registerUser = asyncHandler(async (req, res) => {
  const { username, email } = req.body;
  try {
    const alreadyUsername = await User.findOne({ username: username });
    const alreadyEmail = await User.findOne({ email: email });
    if (alreadyUsername) {
      throw new Error("Username already exists");
    } else if (alreadyEmail) {
      throw new Error("Email already exists");
    } else {
      const newUser = await User.create(req.body);
      res.json(newUser);
    }
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = { registerUser };
