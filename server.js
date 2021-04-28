const http = require("http");
const express = require("express");
const socketio = require("socket.io");
const cors = require("cors");
const router = require("./router");
const crypto = require("crypto");
const Razorpay = require("razorpay");
const shortid = require("shortid");
const razorpay = new Razorpay({
  key_id: process.env.key_id,
  key_secret: process.env.key_secret,
});
const {
  addUser,
  removeUser,
  getUser,
  getUsersInRoom,
} = require("./utils/users");
const { generateMessage } = require("./utils/messages");
const path = require("path");
const app = express();
app.use(cors());
const server = http.createServer(app);
const io = socketio(server, {
  cors: {
    origin: "*",
  },
});
app.use(router);
const port = process.env.PORT || 5000;
const publicDirectoryPath = path.join(
  __dirname,
  "../chat-application/client/public"
);
app.use(express.json());
app.use(express.static(publicDirectoryPath));

//automatically triggered after scoket.join is called

io.on("connection", (socket) => {
  socket.emit("me", socket.id);
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
  });

  //Triggered after sending message

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
  socket.on("callUser", ({ userToCall, signalData, from, name }) => {
    io.to(userToCall).emit("callUser", { signal: signalData, from, name });
  });

  socket.on("answerCall", (data) => {
    io.to(data.to).emit("callAccepted", data.signal);
  });
  socket.on("disconnect", () => {
    socket.broadcast.emit("callEnded");
    // const user = removeUser(socket.id);
    // if (user) {
    //   io.to(user.room).emit(
    //     "message",
    //     generateMessage("Admin", `${user.username} has left !`, user.room)
    //   );
    //   io.to(user.room).emit("roomData", {
    //     users: getUsersInRoom(user.room),
    //   });
    // }
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
app.post("/verification", (req, res) => {
  const SECRET = process.env.SECRET;
  console.log(req.body);

  const shasum = crypto.createHmac("sha256", SECRET);
  shasum.update(JSON.stringify(req.body));
  const digest = shasum.digest("hex");
  console.log(
    "digest = " +
      digest +
      "  " +
      "req.headers['x-razorpay-signature']  " +
      req.headers["x-razorpay-signature"]
  );

  if (digest === req.headers[x - razorpay - signature]) {
    console.log("request is legit");
  } else {
    console.log("request is not legit");
  }

  res.json({ status: "ok" });
});

app.post("/razorpay", async (req, res) => {
  const payment_capture = 1;
  const amount = 499;
  const currency = "INR";
  const notes = "hey";
  const options = {
    amount: amount * 100,
    currency,
    receipt: shortid.generate(),
    payment_capture,
    notes,
  };
  try {
    const response = await razorpay.orders.create(options);
    console.log(response);
    res.json({
      id: response.id,
      currency: response.currency,
      amount: response.amount.toString(),
    });
  } catch (e) {
    console.log(e);
  }
});
server.listen(port, () => {
  console.log(`The server is up and running on port ${port}`);
});
