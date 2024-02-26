import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSocket } from "../context/SocketProvider";

const LobbyScreen = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [room, setRoom] = useState("");

  const socket = useSocket();
  console.log(socket);

  useEffect(() => {
    socket.on("room:join", (data) => {
      console.log("data from back", data);
    });
  }, [socket]);

  const handleJoinRoom = useCallback(
    (data) => {
      const { email, room } = data;
      console.log(email, room);
      navigate(`/room/${room}`);
    },
    [navigate]
  );

  useEffect(() => {
    socket.on("room:join", handleJoinRoom);

    return () => {
      socket.off("room:join", handleJoinRoom);
    };
  }, [socket, handleJoinRoom]);

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();
      console.log({ email, room });
      socket.emit("room:join", { email, room });
    },
    [email, room, socket]
  );

  return (
    <section>
      <form onSubmit={handleSubmit}>
        <label htmlFor="email">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          name="email"
          id="email"
        />

        <label htmlFor="room">Room No</label>
        <input
          type="text"
          name="room"
          id="room"
          value={room}
          onChange={(e) => setRoom(e.target.value)}
        />

        <button>JOIN</button>
      </form>
    </section>
  );
};

export default LobbyScreen;
