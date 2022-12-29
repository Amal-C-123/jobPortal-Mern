const { errbody, respbody } = require("../helper/generateResponse");
const { User } = require("../models/userModel");
const { Post } = require("../models/Post");
const cloudinary = require("../helper/cloudinary");
const { sendMail } = require("../helper/sendMail");
const { saveOtpDb, checkOtpDb } = require("../helper/otpDb");

module.exports = {
  doSignup: async (req, res) => {
    const { email } = req.body;
    let generatedOtp = Math.floor(1000 + Math.random() * 9000);
    try {
      const userExist = await User.findOne({ email });
      if (userExist) return errbody(res, "user already exists");
      let mailObj = {
        subject: "JobWiser SignUp OTP ✔",
        to: email,
        OTP: generatedOtp,
      };
      sendMail(mailObj).then((result) => {
        saveOtpDb(email, generatedOtp);
        if (result) {
          return respbody(res, "sending Otp for confirmation");
        } else {
          return errbody(res, "otp generation failed");
        }
      });
    } catch (err) {
      return errbody(res, err);
    }
  },

  resendOtp: (req, res) => {
    let { email } = req.body;
    let generatedOtp = Math.floor(1000 + Math.random() * 9000);
    let mailObj = {
      subject: "JobWiser SignUp OTP ✔",
      to: email,
      OTP: generatedOtp,
    };
    sendMail(mailObj).then((result) => {
      saveOtpDb(email, generatedOtp);
      if (result) {
        return respbody(res, "sending Otp for confirmation");
      } else {
        return errbody(res, "otp generation failed");
      }
    });
  },

  signupVerification: async (req, res) => {
    const { email, otp } = req.body;
    let status = await checkOtpDb(email, otp);
    console.log(status);
    if (status) {
      User.create(req.body, (err, doc) => {
        if (err) {
          console.error(err);
          return errbody(res, err.message);
        }
      });
      return respbody(res, "Otp verified Successfully");
    } else {
      return errbody(res, "Please Enter correct Otp");
    }
  },

  doLogin: async (req, res) => {
    const { email, password } = req.body;
    try {
      const user = await User.findOne({ email });
      if (user) {
        const correctPassword = await user.comparePassword(password);
        if (correctPassword) {
          const token = await user.generateToken();
          return respbody(res, { user, token });
        } else {
          return errbody(res, "Incorrect Password");
        }
      } else {
        return errbody(res, "Invalid Username");
      }
    } catch (err) {
      return errbody(res, err);
    }
  },

  post: async (req, res) => {
    //user post
    const { _id, name, postContent, image, date } = req.body;
    let cloudUrl;
    if (postContent || image) {
      try {
        if (image) {
          const { url } = await cloudinary.uploader.upload(
            image,
            {
              upload_preset: "jobWiser",
              public_id: `post${Date.now()}`,
              allowed_formats: ["png", "jpg", "jpeg", "svg", "ico", "webp"],
            },
            function (err, result) {
              if (err) {
                console.log(err);
              }
            }
          );
          cloudUrl = url;
        }
        const postDoc = {
          name,
          userId: _id,
          description: postContent,
          image: "",
          likes: [],
          comments: [],
          date,
        };
        image ? (postDoc.image = cloudUrl) : null;
        const post = new Post(postDoc);
        post.save((err, doc) => {
          if (err) console.log(err);
          else return respbody(res, "Post Saved");
        });
      } catch (err) {
        console.log(err);
      }
    } else {
      return errbody(res, "please fill fields");
    }
  },

  getFeed: async (req, res) => {
    let post = await Post.find({}).populate("userId");
    try {
      post.reverse();
      return respbody(res, post);
    } catch (err) {
      return errbody(res, err);
    }
  },

  like: async (req, res) => {
    const { postId, userId } = req.body;
    try {
      let checkLiked = await Post.updateOne(
        { _id: postId },
        {
          $pull: { likes: userId },
        }
      );

      if (!checkLiked.modifiedCount) {
        Post.findByIdAndUpdate(postId, {
          $push: { likes: userId },
        }).catch((err) => {
          console.log(err);
        });
        return respbody(res, "liked");
      } else {
        return respbody(res, "unliked");
      }
    } catch (err) {
      return errbody(res, err.message);
    }
  },

  comment: async (req, res) => {
    let { userId, postId, userName, comment } = req.body;
    let cmntDoc = {
      userId,
      name: userName,
      comment,
      timeStamp: new Date(),
    };
    try {
      if (comment) {
        Post.updateOne(
          { _id: postId },
          {
            $push: { comments: cmntDoc },
          }
        ).then(() => {
          return respbody(res, "comment success");
        });
      }
    } catch (err) {
      return errbody(res, err.message);
    }
  },

  deleteComment: (req, res) => {
    let { comment_id, post_id } = req.query;
    Post.findOneAndUpdate(
      { _id: post_id },
      { $pull: { comments: { _id: comment_id } } },
      { safe: true, multi: false }
    )
      .then((d) => {
        return respbody(res, "comment deleted");
      })
      .catch((err) => {
        return errbody(res, err.message);
      });
  },

  getPostComments: (req, res) => {
    Post.findOne({ _id: req.query.postId })
      .select("comments")
      .populate("comments.userId")
      .then((d) => {
        d.comments.reverse();
        return respbody(res, d);
      })
      .catch((err) => {
        return errbody(err, err.message);
      });
  },

  deletePost: (req, res) => {
    Post.deleteOne({ _id: req.query.post_id })
      .then((data) => {
        console.log(data);
        return respbody(res, "post-deleted");
      })
      .catch((err) => {
        console.log(err.message);
        return errbody(res, err.message);
      });
  },
  getUser: (req, res) => {
    let userId = req.params.id;
    User.findOne({ _id: userId })
      .select("-password")
      .then((doc) => {
        doc?.experience.reverse();
        doc?.education.reverse();
        respbody(res, doc);
      });
  },

  getAllUser: (req, res) => {
    let { userId } = req.query;
    User.find({
      $and: [{ _id: { $ne: userId } }, { connections: { $ne: userId } }],
    })
      .select("-password")
      .then((doc) => {
        respbody(res, doc);
      });
  },

  getConnections: (req, res) => {
    let { userId } = req.query;
    User.find({
      $and: [{ _id: { $ne: userId } }, { connections: { $eq: userId } }],
    })
      .select("-password")
      .then((doc) => {
        return respbody(res, doc);
      });
  },

  connectUser: async (req, res) => {
    try {
      let { userId, connectId } = req.body;
      let checkConnected = await User.updateOne(
        { _id: connectId },
        {
          $pull: { connections: userId },
        }
      );
      if (!checkConnected.modifiedCount) {
        User.findByIdAndUpdate(connectId, {
          $push: { connections: userId },
        }).then((doc) => {
          return respbody(res, "connected");
        });
      } else {
        return respbody(res, "dis-connected");
      }
    } catch (err) {
      return respbody(res, err.message);
    }
  },

  setProfile: async (req, res) => {
    const { section } = req.body;
    if (section === "profile-left") {
      let { userId, designation, about, skills, profile_pic } = req.body;
      let prevPic = await User.findById(userId).select("profile_pic");
      if (profile_pic !== "" && profile_pic !== prevPic?.profile_pic) {
        let { url } = await cloudinary.uploader.upload(
          profile_pic,
          {
            upload_preset: "jobWiser",
            public_id: `profilePic${Date.now()}`,
            allowed_formats: ["png", "jpg", "jpeg", "svg", "ico", "webp"],
          },
          function (err, result) {
            if (err) {
              console.log(err);
            }
          }
        );
        profile_pic = url;
      }
      User.findByIdAndUpdate(
        userId,
        {
          designation,
          about,
          skills,
          profile_pic,
        },
        { new: true }
      )
        .then((doc) => {
          return respbody(res, doc);
        })
        .catch((err) => {
          console.log(err.message);
        });
    } else if (section === "experience") {
      let { userId, companyName, designation, timeSpan } = req.body;
      let expId = Math.floor(1000 + Math.random() * 9000);
      User.findByIdAndUpdate(
        userId,
        {
          $push: { experience: { expId, companyName, designation, timeSpan } },
        },
        { new: true }
      )
        .then((doc) => {
          doc?.experience.reverse();
          return respbody(res, doc);
        })
        .catch((err) => {
          console.log(err.message);
        });
    } else if (section === "education") {
      let { userId, university, course, timeSpan } = req.body;
      let eduId = Math.floor(1000 + Math.random() * 9000);
      User.findByIdAndUpdate(
        userId,
        {
          $push: { education: { eduId, university, course, timeSpan } },
        },
        { new: true }
      )
        .then((doc) => {
          doc?.education.reverse();
          return respbody(res, doc);
        })
        .catch((err) => {
          console.log(err.message);
        });
    } else if (section === "basic-info") {
      const { userId, age, yearsOfExperience, ctc, location } = req.body;
      User.findByIdAndUpdate(
        userId,
        {
          age: parseInt(age),
          yearsOfExperience: parseInt(yearsOfExperience),
          ctc: parseInt(ctc),
          location,
        },
        { new: true }
      ).then((doc) => {
        return respbody(res, doc);
      });
    }
  },

  editProfileExperinece: async (req, res) => {
    const { userId, expId, companyName, designation, timeSpan } = req.body;
    await User.findOneAndUpdate(
      { _id: userId, "experience.expId": Number(expId) },
      {
        $set: {
          "experience.$.companyName": companyName,
          "experience.$.designation": designation,
          "experience.$.timeSpan": timeSpan,
        },
      },
      {
        new: true,
      }
    )
      .then((doc) => {
        doc?.experience.reverse();
        return respbody(res, doc);
      })
      .catch((err) => {
        console.log(err.message);
      });
  },
  editProfileEducation: async (req, res) => {
    const { userId, eduId, university, course, timeSpan } = req.body;
    console.log(req.body);
    await User.findOneAndUpdate(
      { _id: userId, "education.eduId": Number(eduId) },
      {
        $set: {
          "education.$.university": university,
          "education.$.course": course,
          "education.$.timeSpan": timeSpan,
        },
      },
      {
        new: true,
      }
    )
      .then((doc) => {
        doc?.education.reverse();
        return respbody(res, doc);
      })
      .catch((err) => {
        console.log(err.message);
      });
  },
  deleteProfileExperinece: (req, res) => {
    let { expId, userId } = req.query;
    User.findByIdAndUpdate(
      userId,
      {
        $pull: {
          experience: { expId: Number(expId) },
        },
      },
      { new: true }
    ).then((doc) => {
      doc?.experience.reverse();
      return respbody(res, doc);
    });
  },

  deleteProfileEducation: (req, res) => {
    let { eduId, userId } = req.query;
    User.findByIdAndUpdate(
      userId,
      {
        $pull: {
          education: { eduId: Number(eduId) },
        },
      },
      { new: true }
    ).then((doc) => {
      doc?.education.reverse();
      return respbody(res, doc);
    });
  },
};
