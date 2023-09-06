const express = require("express");
const {
  registerUser,
  loginUser,
  getAllUser,
  getaUser,
  updateUser,
  deleteUser,
} = require("../controller/userCtrl");
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");
const router = express.Router();

router.post("/register", registerUser);
router.post("/loginUser", loginUser);
router.get("/", authMiddleware, isAdmin, getAllUser);
router.get("/:id", authMiddleware, getaUser);
router.put("/", authMiddleware, updateUser);
router.delete("/", authMiddleware, deleteUser);

module.exports = router;
