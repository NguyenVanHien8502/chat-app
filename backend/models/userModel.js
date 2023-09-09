const mongoose = require("mongoose"); // Erase if already required
const bcrypt = require("bcrypt");

// Declare the Schema of the Mongo model
var userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      min: 3,
      max: 20,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      min: 8,
    },
    role: {
      type: String,
      default: "user",
    },
    avatar: {
      type: String,
      default:
        "https://cdn.pixabay.com/photo/2017/09/01/00/15/png-2702691_640.png",
    },
    refreshToken: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  const salt = await bcrypt.genSaltSync(10);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.isMatchedPassword = async function (enterPassword) {
  return await bcrypt.compare(enterPassword, this.password);
};

//Export the model
module.exports = mongoose.model("User", userSchema);
