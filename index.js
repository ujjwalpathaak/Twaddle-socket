import { Server } from "socket.io";

const io = new Server(process.env.PORT || 9000, {
  cors: {
    origin: "http://localhost:3000"
    // origin: "http://localhost:5000"
  },
});

let users = [];

const removeUser = (socketId) => {
  users = users.filter((user) => user.socketId !== socketId);
};

const addUser = (userData, socketId) => {
  !users.some((user) => user.sub === userData.sub) &&
    users.push({ ...userData, socketId });
};

const getUser = (userId) => {
  return users.find((user) => user.sub === userId);
};

io.on("connection", (socket) => {
  console.log("server running");
  socket.on("addUsers", (userData) => {
    addUser(userData, socket.id);
    io.emit("getUsers", users);
  });

  socket.on("sendMessage", (data) => {
    const user = getUser(data.receiverId);
    io.to(user?.socketId).emit("getMessage", data);
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");
    removeUser(socket.id);
    io.emit("getUsers", users);
  });
});
