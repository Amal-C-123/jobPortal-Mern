const io = require("socket.io")(8800, {
  cors: {
    origin: "http://localhost:3000",
  },
});

let activeUsers = [];

io.on("connection", (socket) => {
  //adding new User
  socket.on("new-user-add", (newUserId) => {
    //on --> take something from the other side
    // if user is not added previously
    if (!activeUsers.some((user) => user.userId === newUserId)) {
      activeUsers.push({
        userId: newUserId,
        socketId: socket.id,
      });
    }
    console.log("Connected Users", activeUsers);
    io.emit("get-users", activeUsers); // emit --> when we have to send something to the otherside
  });

  socket.on("send-message", (data) => {
    const { recieverId } = data;
    const user = activeUsers.find((user) => user.userId === recieverId);
    console.log("sending from socket to : receiverId", recieverId);
    console.log("data :", data);
    console.log("sending to this ", user);
    if (user) {
      io.to(user.socketId).emit("receive-message", data);
    }
  });

  socket.on("send-notifications", (data) => {
    let { postOwnerId, ...notification } = data;
    const receiver = activeUsers.find((user) => user.userId === postOwnerId);
    if (receiver) {
      io.to(receiver.socketId).emit("receive-notification", notification);
    }
  });

  socket.on("logout", (userId) => {
    activeUsers = activeUsers.filter((user) => user.userId !== userId);
    console.log("user logout", activeUsers);
    io.emit("get-users", activeUsers);
  });

  socket.on("disconnect", () => {
    activeUsers = activeUsers.filter((user) => user.socketId !== socket.id);
    console.log("user Disconnected", activeUsers);
    io.emit("get-users", activeUsers);
  });
});
