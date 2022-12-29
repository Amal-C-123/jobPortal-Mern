const { UserOtp } = require("../models/userModel");

let generatedOtp = Math.floor(1000 + Math.random() * 9000);
let exist = UserOtp.find()
let otp = new UserOtp({ otps: [] }).save()
await .save((err, doc) => {});
