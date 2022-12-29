const express = require("express");
const app = express();
const path = require("path");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
require("dotenv").config();
const mongoose = require("mongoose");

mongoose
  .connect(process.env.mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("database Connected");
  })
  .catch((err) => {
    console.log(err.message);
  });

const userRoutes = require("./routes/userRoutes");
const chatRoutes = require("./routes/chatRoutes");
// const adminRoutes = require("./routes/adminRoutes");

app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(cookieParser());
app.use(logger("dev"));

//routing
app.use("/", userRoutes);
app.use("/chat", chatRoutes);
// app.use("/admin",adminRoutes);

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Server Listening on ${port}`);
});
