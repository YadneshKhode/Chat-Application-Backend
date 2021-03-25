// const http = require("http");
// const express = require("express");
// const socketio = require("socket.io");
// const cors = require("cors");
// const router = require("./router");
// const {
//   addUser,
//   removeUser,
//   getUser,
//   getUsersInRoom,
// } = require("./utils/users");
// const { generateMessage } = require("./utils/messages");
// const path = require("path");
// const app = express();
// const server = http.createServer(app);
// app.use(cors());
// const io = socketio(server, {
//   cors: {
//     origin: "*",
//   },
// });
// app.use(router);
// const port = process.env.PORT || 5000;
// const publicDirectoryPath = path.join(
//   __dirname,
//   "../chat-application/client/public"
// );
// app.use(express.json());
// app.use(express.static(publicDirectoryPath));

// //automatically triggered after scoket.join is called

// io.on("connection", (socket) => {
//   socket.on("join", ({ username, room, displayPhoto, email }, callback) => {
//     const { error, user } = addUser({
//       id: socket.id,
//       username,
//       room,
//       displayPhoto,
//       email,
//     });
//     if (error) {
//       return callback(error);
//     }

//     socket.join(user.room); //emits only to those who are in this room in other words adds this specific connection ( socket ) into the room.

//     // triggered when user joins new room
//     socket.emit(
//       "message",
//       generateMessage(
//         "Admin",
//         `Hello ${user.username}, welcome to the room ${user.room}`,
//         room
//       )
//     );
//     io.to(user.room).emit("roomData", {
//       users: getUsersInRoom(user.room),
//     });
//     // triggered when user joins room
//     if (user) {
//       socket.broadcast
//         .to(user.room)
//         .emit(
//           "message",
//           generateMessage("Admin", `${user.username} has joined!`, room)
//         );
//     }
//     io.to(user.room).emit("roomData", {
//       users: getUsersInRoom(user.room),
//     });

//     callback();
//   });

//   //Triggered after sending message

//   socket.on("sendMessage", (message, callback) => {
//     const user = getUser(socket.id);
//     if (user) {
//       io.to(user.room).emit(
//         "message",
//         generateMessage(user.username, message, user.room)
//       );
//     }
//     callback();
//   });

//   socket.on("disconnect", () => {
//     const user = removeUser(socket.id);
//     if (user) {
//       io.to(user.room).emit(
//         "message",
//         generateMessage("Admin", `${user.username} has left !`, user.room)
//       );
//       io.to(user.room).emit("roomData", {
//         users: getUsersInRoom(user.room),
//       });
//     }
//   });
//   socket.on("loggedOut", () => {
//     const user = removeUser(socket.id);
//     console.log("loggedOut");
//     console.log(user);
//     if (user) {
//       io.to(user.room).emit(
//         "message",
//         generateMessage("Admin", `${user.username} has left !`, user.room)
//       );
//       io.to(user.room).emit("roomData", {
//         users: getUsersInRoom(user.room),
//       });
//     }
//   });

//   //used to remove user when user leaves room

//   socket.on("leftRoom", (room, username) => {
//     const user = getUser(socket.id);
//     console.log(user);

//     io.to(room).emit(
//       "message",
//       generateMessage("Admin", username + "has  left !", room)
//     );
//   });
// });

// server.listen(port, () => {
//   console.log(`The server is up and running on port ${port}`);
// });
const express = require("express");
const app = express();
const port = process.env.PORT || 5000;
const path = require("path");
const publicDirectoryPath = path.join(
  __dirname,
  "../chat-application/client/public"
);
const http = require("http");
const socketio = require("socket.io");
const cors = require("cors");
const router = require("./router");
const server = http.createServer(app);
const io = socketio(server, {
  cors: {
    origin: "*",
  },
});
app.use(router);
const {
  addUser,
  removeUser,
  getUser,
  getUsersInRoom,
  removeUserFromRoom,
} = require("./utils/users");
const { generateMessage } = require("./utils/messages");
app.use(express.json());
app.use(express.static(publicDirectoryPath));
app.use(cors());
//automatically triggered after scoket.join is called
io.on("connect", (socket) => {
  socket.on("join", ({ username, room, displayPhoto, email }, callback) => {
    const { error, user } = addUser({
      id: socket.id,
      username,
      room,
      displayPhoto,
      email,
    });
    if (error) {
      return callback(error);
    }
    socket.join(user.room); //emits only to those who are in this room in other words adds this specific connection ( socket ) into the room.
    // triggered when user joins new room
    socket.emit(
      "message",
      generateMessage(
        "Admin",
        `Hello ${user.username}, welcome to the room ${user.room}`,
        room
      )
    );
    io.to(user.room).emit("roomData", {
      users: getUsersInRoom(user.room),
    });
    // triggered when user joins room
    if (user) {
      socket.broadcast
        .to(user.room)
        .emit(
          "message",
          generateMessage("Admin", `${user.username} has joined!`, room)
        );
    }
    io.to(user.room).emit("roomData", {
      users: getUsersInRoom(user.room),
    });
    callback();

    socket.on("sendMessage", (message, callback) => {
      const user = getUser(socket.id);
      if (user) {
        io.to(user.room).emit(
          "message",
          generateMessage(user.username, message, user.room)
        );
      }
      callback();
    });
    socket.on("disconnect", () => {
      const user = removeUser(socket.id);
      if (user) {
        io.to(user.room).emit(
          "message",
          generateMessage("Admin", `${user.username} has left !`, user.room)
        );
        io.to(user.room).emit("roomData", {
          users: getUsersInRoom(user.room),
        });
      }
    });
    socket.on("loggedOut", () => {
      const user = removeUser(socket.id);
      console.log("loggedOut");
      console.log(user);
      if (user) {
        io.to(user.room).emit(
          "message",
          generateMessage("Admin", `${user.username} has left !`, user.room)
        );
        io.to(user.room).emit("roomData", {
          users: getUsersInRoom(user.room),
        });
      }
    });

    //used to remove user when user leaves room

    socket.on("leftRoom", (room, username) => {
      const user = getUser(socket.id);
      console.log(user);

      io.to(room).emit(
        "message",
        generateMessage("Admin", username + "has  left !", room)
      );
    });
  });
  server.listen(port, () => {
    console.log(`The server is up and running on port ${port}`);
  });
});
