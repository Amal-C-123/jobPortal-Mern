const { UserOtp } = require("../models/userModel");

module.exports = {
  saveOtpDb: async (email, generatedOtp) => {
    let existUserOtp = await UserOtp.findOne({ email });
    if (existUserOtp) {
      await UserOtp.findOneAndUpdate({ email }, { otp: generatedOtp });
    } else {
      await new UserOtp({ email, otp: generatedOtp }).save();
    }
  },

  checkOtpDb: async (email, submittedOtp) => {
    let { otp } = await UserOtp.findOne({ email }).select("otp");
    if (otp === parseInt(submittedOtp)) {
      return true;
    } else {
      return false;
    }
  },
};
