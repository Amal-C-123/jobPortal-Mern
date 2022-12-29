// let { User } = require("../models/userModel");
const jwt = require("jsonwebtoken");
const { errbody } = require("../helper/generateResponse");

let verifyToken = (req, res, next) => {
  try {
    const token = req.headers.token.split(" ")[1];
    const decoded = jwt.verify(token, process.env.jWT_USER);
    if (decoded) {
      next();
    }
  } catch (err) {
    return errbody(res, err.message);
  }
};

module.exports = { verifyToken };
