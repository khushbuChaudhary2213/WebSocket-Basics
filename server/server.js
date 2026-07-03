const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });
const http = require("http");
const express = require("express");
const { Server } = require("socket.io");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const cookie = require("cookie");

const port = 9000;
const secretKey = "qwerty";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL,
    credentials: true,
  },
});

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  }),
);

const user = "khushbu";

// middleware
io.use((socket, next) => {
  const cookies = cookie.parse(socket.request.headers.cookie || "");

  const token = cookies.token;
  if (!token) {
    return next(new Error("Authentication Error"));
  }

  try {
    const decoded = jwt.verify(token, secretKey);
    next();
  } catch (err) {
    next(new Error("Invalid Token"));
  }

  // can be used for authentication!
  // if (user == "khushbu") next();
});

// Socket.io
io.on("connection", (socket) => {
  console.log("User connected!");
  console.log("ID", socket.id);

  socket.emit("welcome", `${socket.id}`);

  // Send to everyone except this socket!
  // socket.broadcast.emit("welcome", `${socket.id} joined the server `);

  socket.on("message", ({ message, room }) => {
    console.log(message);
    console.log(room);

    // for sending to specific client
    io.to(room).emit("receive-message", message);

    // socket.broadcast.emit("receive-message", { message, room });
  });

  socket.on("join-room", (roomName) => {
    socket.join(roomName);
    console.log(`User joined room: ${roomName}`);
  });

  // socket.on("disconnect", () => {
  //   console.log("User disconnected!");
  // });
});

///////////////////////////
// HTTP Requests
app.use(express.static("./public"));

app.get("/", (req, res) => {
  res.status(200).json({
    status: true,
    message: "Welcome For Learning WebSocket!",
  });
});

app.get("/login", (req, res) => {
  const token = jwt.sign({ _id: "asdfghjkl" }, secretKey);

  // console.log("Generated token:", token);
  res
    .cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    })
    .json({
      status: true,
      message: "Login Successfully",
    });
});

server.listen(port, () => {
  console.log(`Server started at PORT: ${port}`);
});
