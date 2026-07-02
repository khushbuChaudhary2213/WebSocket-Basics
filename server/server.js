const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });
const http = require("http");
const express = require("express");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL,
  },
});

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
  }),
);

// middleware
io.use((socket, next) => {
  // Like can be used for authentication!

  next();
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

// HTTP Requests
app.use(express.static("./public"));

app.get("/", (req, res) => {
  return res.sendFile("/public/index.html");
});

server.listen(9000, () => {
  console.log(`Server started at PORT: 9000`);
});
