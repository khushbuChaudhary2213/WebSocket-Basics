const http = require("http");
const express = require("express");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Socket.io
io.on("connection", (socket) => {
  socket.on("user-message", (msg) => {
    // console.log("A new user message", msg);
    io.emit("server-message", msg);
  });
});

// HTTP Requests
app.use(express.static("./public"));

app.get("/", (req, res) => {
  return res.sendFile("/public/index.html");
});

server.listen(9000, () => {
  console.log(`Server started at PORT: 9000`);
});
