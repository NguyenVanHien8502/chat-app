const express = require("express");
const dbConnect = require("./config/dbConnect");
const app = express();
const dotenv = require("dotenv").config();
const PORT = process.env.PORT || 6000;

dbConnect();

app.use("/", (req, res) => {
  res.send("hello from servesdasdr");
});

app.listen(PORT, () => {
  console.log(`Server is running at PORT ${PORT}`);
});
