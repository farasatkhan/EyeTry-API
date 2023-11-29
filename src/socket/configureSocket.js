const socketIO = require('socket.io');

function configureSocket(server) {
  const io = socketIO(server,{
    cors: {
      origin: ['http://localhost:5173','http://localhost:5000'], 
    }
  });

  let activeUsers = [];

  io.on("connection", (socket) => {
    // Add new user
    socket.on("new-user-add", (newUserId) => {
      // If user is not added previously
      if (!activeUsers.some((user) => user.userId === newUserId)) {
        activeUsers.push({ userId: newUserId, socketId: socket.id });
        console.log("New User Connected", activeUsers);
      }
      // send active users 
      io.emit("get-users", activeUsers);
    });

    socket.on("disconnect", () => {
      // remove user from active users
      activeUsers = activeUsers.filter((user) => user.socketId !== socket.id);
      console.log("User Disconnected", activeUsers);
      // send all active users to all users
      io.emit("get-users", activeUsers);
    });

    // send message to a specific user
    socket.on("send-message", (data) => {
      console.log("Message sent",data)
      const { receiverId } = data;
      const user = activeUsers.find((user) => user.userId === receiverId);
      if (user) {
        io.to(user.socketId).emit("receive-message", data);
        console.log("Message Recevier ",user)
      }
    });
  });

  return io;
}

module.exports = configureSocket;
