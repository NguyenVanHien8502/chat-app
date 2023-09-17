const express = require("express");
const dbConnect = require("./config/dbConnect");
const app = express();
const dotenv = require("dotenv").config();
const PORT = process.env.PORT || 6000;
const authRouter = require("./routes/userRoute");
const messageRouter = require("./routes/messageRoute");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const cors = require("cors");
const socket = require("socket.io");
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
app.use("/api/message", messageRouter);

app.get("/image/:image", getImage);
app.post(
  "/api/uploads",
  authMiddleware,
  uploadPhoto.single("file"),
  uploadImage
);

app.use(notFound);
app.use(errorHandler);

const server = app.listen(PORT, () => {
  console.log(`Server is running at PORT ${PORT}`);
});

//socket.io
const io = socket(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Authorization", "Content-Type"],
    credentials: true,
  },
});

global.onlineUsers = new Map();

io.on("connection", (socket) => {
  global.chatSocket = socket; // hình như hơi thừa câu lệnh này
  socket.on("add-user", (userId) => {
    onlineUsers.set(userId, socket.id);
  });

  socket.on("send-msg", (data) => {
    const sendUserSocket = onlineUsers.get(data.receiver);
    if (sendUserSocket) {
      socket.to(sendUserSocket).emit("receive-msg", data);
    }
  });
});
