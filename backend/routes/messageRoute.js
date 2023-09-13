const express = require("express");
const { authMiddleware } = require("../middlewares/authMiddleware");
const { addMsg, getAllMsg } = require("../controller/messageCtrl");
const router = express.Router();

router.post("/add-msg", authMiddleware, addMsg);
router.get("/get-all-msg", authMiddleware, getAllMsg);

module.exports = router;
