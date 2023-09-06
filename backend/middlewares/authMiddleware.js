const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");

const authMiddleware = asyncHandler(async (req, res, next) => {
  let token;
  if (req?.headers?.authorization?.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
    try {
      const decode = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decode?.id);
      req.user = user;
      next();
    } catch (error) {
      throw new Error("Not authorized token expired. Please login again.");
    }
  } else {
    throw new Error("There is no token attached to headers");
  }
});

const isAdmin = asyncHandler(async (req, res, next) => {
  if (req.user.role !== "admin") throw new Error("You are not an admin");
  next();
});

module.exports = { authMiddleware, isAdmin };
