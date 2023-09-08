const express = require("express");
const dbConnect = require("./config/dbConnect");
const app = express();
const dotenv = require("dotenv").config();
const PORT = process.env.PORT || 6000;
const authRouter = require("./routes/userRoute");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const cors = require("cors");
const { notFound, errorHandler } = require("./middlewares/errorHandler");
const { authMiddleware } = require("./middlewares/authMiddleware");
const {
  uploadPhoto,
  uploadImage,
  getImage,
} = require("./middlewares/uploadImage");

dbConnect();

app.use(morgan("dev"));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(cookieParser());

app.use(cors());

app.use("/api/user", authRouter);

app.get("/image/:image", getImage);
app.post(
  "/api/uploads",
  authMiddleware,
  uploadPhoto.single("file"),
  uploadImage
);

app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running at PORT ${PORT}`);
});
