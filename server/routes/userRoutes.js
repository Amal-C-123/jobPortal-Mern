const express = require("express");
const {
  doSignup,
  doLogin,
  post,
  getFeed,
  like,
  comment,
  deleteComment,
  getPostComments,
  deletePost,
  signupVerification,
  getConnections,
  setProfile,
  connectUser,
  editProfileExperinece,
  editProfileEducation,
  deleteProfileExperinece,
  deleteProfileEducation,
  getAllUser,
  resendOtp,
  getUser,
} = require("../controllers/userController");
const { verifyToken } = require("../middlewares/Auth");
const { User } = require("../models/userModel");
const router = express.Router();

router.post("/signup", doSignup);
router.post("/verify-otp", signupVerification);
router.post("/resend-otp", resendOtp);
router.post("/login", doLogin);
router.post("/posts", verifyToken, post);
router.get("/feed", verifyToken, getFeed);
router.post("/like", verifyToken, like);
router.post("/comment", verifyToken, comment);
router.get("/delete-comment", verifyToken, deleteComment);
router.get("/get-comments", verifyToken, getPostComments);
router.get("/delete-post", verifyToken, deletePost);
router.get("/getUser/:id", verifyToken, getUser);
router.get("/getAllUsers", verifyToken, getAllUser);
router.get("/get-connections", verifyToken, getConnections);
router.post("/setProfile", verifyToken, setProfile);
router.post("/connect-user", verifyToken, connectUser);
router.post("/edit-experience", verifyToken, editProfileExperinece);
router.post("/edit-education", verifyToken, editProfileEducation);
router.get("/delete-experience", verifyToken, deleteProfileExperinece);
router.get("/delete-education", verifyToken, deleteProfileEducation);

// chat Routes........................................................

router.post("/createTestUser", (req, res) => {
  User.create(req.body);
  res.send("done");
});

module.exports = router;
