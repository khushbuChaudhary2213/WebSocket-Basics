import { useEffect, useMemo, useState } from "react";
import "./index.css";
import { io } from "socket.io-client";

function App() {
  const socket = useMemo(() => io(import.meta.env.VITE_BACKEND_URL), []);
  const [allMessages, setAllMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [socketID, setSocketID] = useState("");
  const [room, setRoom] = useState("");
  const [roomName, setRoomName] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    socket.emit("message", { message, room });
    setMessage("");
  }

  function joinRoomHandler(e) {
    e.preventDefault();
    socket.emit("join-room", roomName);
    setRoomName("");
  }

  useEffect(() => {
    socket.on("connect", () => {
      console.log("Server Connected!");
    });

    socket.on("receive-message", (data) => {
      console.log(data);
      setAllMessages((messages) => [...messages, data]);
    });

    socket.on("welcome", (s) => {
      console.log(s);
      setSocketID(s);
    });

    // return () => {
    //   socket.disconnect();
    // };
  }, []);

  return (
    <div>
      <h5 style={{ color: "white" }}>Client Id: {socketID}</h5>

      <form onSubmit={joinRoomHandler}>
        <h5>JOIN ROOM</h5>

        <input
          value={roomName}
          type="text"
          placeholder="room name"
          onChange={(e) => setRoomName(e.target.value)}
        />

        <button type="submit">JOIN</button>
      </form>

      <form onSubmit={handleSubmit}>
        <input
          value={message}
          type="text"
          placeholder="message"
          onChange={(e) => setMessage(e.target.value)}
        />
        <input
          value={room}
          type="text"
          placeholder="room"
          onChange={(e) => setRoom(e.target.value)}
        />

        <button type="submit">Send</button>
      </form>
      {allMessages.map((message) => {
        return <h6 style={{ color: "white" }}>{message}</h6>;
      })}
    </div>
  );
}

export default App;
