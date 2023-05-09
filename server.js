import { Server } from "socket.io";

const io = new Server(process.env.PORT || 9000, {
  cors: true,
});

// online array for all onlineUsersArray
let onlineUsersArray = [];

const addUser = (userData, socketId) => {
  let exist = false;
  for (let i = 0; i < onlineUsersArray.length; i++) {
    if (userData.sub == onlineUsersArray[i].sub) {
      exist = true;
      break;
    }
  }
  if (!exist) {
    onlineUsersArray.push({ ...userData, socketId });
  }
};

const getUser = (userId) => {
  for (let i = 0; i < onlineUsersArray.length; i++) {
    if (userId == onlineUsersArray[i].sub) {
      return onlineUsersArray[i];
    }
  }
};

io.on("connect", (socket) => {
  socket.on("addUsers", (userData) => {
    addUser(userData, socket.id);
    io.emit("getUsers", onlineUsersArray);
  });

  socket.on("sendMessage", (data) => {
    const user = getUser(data.receiverId);
    if (!user) {
      io.emit("noUserFound");
    } else {
      io.to(user.socketId).emit("getMessage", data);
    }
  });

  socket.on("getActiveUsers", (data) => {
    io.emit("activeUsers", onlineUsersArray);
  });
});
