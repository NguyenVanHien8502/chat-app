const multer = require("multer");
const path = require("path");
const crypto = require("crypto");
const asyncHandle = require("express-async-handler");
const fs = require("fs");

const multerStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../public/images"));
  },
  filename: function (req, file, cb) {
    const randomName = crypto.randomBytes(10).toString("hex");
    const extName = path.extname(file.originalname);
    cb(null, file.fieldname + "-" + randomName + extName);
  },
});

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(
      {
        msg: "Unsupport file format",
      },
      false
    );
  }
};

const uploadPhoto = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

const uploadImage = asyncHandle(async (req, res) => {
  const url = `${req.protocol}://${req.get("host")}/image/${req.file.filename}`;
  res.json({
    status: true,
    url: url,
  });
});

const getImage = asyncHandle(async (req, res) => {
  const { image } = req.params;
  const originPath = path.join(__dirname, "../public/images");
  const fullPath = path.join(originPath, image);
  fs.access(fullPath, fs.constants.F_OK, (err) => {
    if (!err) {
      res.sendFile(fullPath);
    } else {
      res.json({
        msg: "There is error when get image",
        status: false,
      });
    }
  });
});

module.exports = { uploadPhoto, uploadImage, getImage };
