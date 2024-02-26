import React, { useState, useEffect, useCallback } from "react";
import { useSocket } from "../context/SocketProvider";

const Room = () => {
  const [socketId, setSocketId] = useState(null);
  const socket = useSocket();
  const handleUserJoined = useCallback(({ email, id }) => {
    console.log(`Email - ${email} joined the room.`);
    setSocketId(id);
  }, []);

  useEffect(() => {
    socket.on("room:joined", handleUserJoined);

    return () => {
      socket.off("room:joined", handleUserJoined);
    };
  }, [socket, handleUserJoined]);

  return (
    <div>
      <h1>Room</h1>
      <h3>{socketId ? "Connected" : "No one in the room"}</h3>
    </div>
  );
};

export default Room;
