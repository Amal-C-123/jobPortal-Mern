const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  mobile: {
    type: Number,
  },
  age: { type: Number },
  yearsOfExperience: { type: Number },
  ctc: { type: Number },
  location: { type: String },
  designation: { type: String },
  about: { type: String },
  profile_pic: { type: String },
  skills: { type: Array },
  connections: { type: Array },
  experience: { type: Array },
  education: { type: Array },
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateToken = function () {
  var user = this;
  var token = jwt.sign(
    { userId: user._id.toHexString() },
    process.env.jWT_USER,
    {
      expiresIn: "10d",
    }
  );
  return token;
};

const User = mongoose.model("User", userSchema);

const otp = mongoose.Schema({
  email: { type: String },
  otp: { type: Number },
  // sessionActivity: { type: Date, expires: "60s", default: Date.now },
});

const UserOtp = mongoose.model("signupOtps", otp);

module.exports = { User, UserOtp };
