import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useSocket } from "../context/SocketProvider";
import ReactPlayer from "react-player";
import peer from "../service/peer";

const Room = () => {
  const [socketId, setSocketId] = useState(null);
  const [mySteam, setMyStream] = useState(null);
  const navigate = useNavigate();
  const socket = useSocket();
  const handleUserJoined = useCallback(({ email, id }) => {
    console.log(`Email - ${email} joined the room.`);
    setSocketId(id);
  }, []);

  const handleIncomingCall = useCallback(({ from, offer }) => {
    console.log(`Incoming call from : ${from} ${offer}`);
  }, []);

  useEffect(() => {
    socket.on("room:joined", handleUserJoined);
    socket.on("incoming:call", handleIncomingCall);

    return () => {
      socket.off("room:joined", handleUserJoined);
      socket.off("incoming:call", handleIncomingCall);
    };
  }, [socket, handleUserJoined, handleIncomingCall]);

  const handleCallUser = useCallback(async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: true,
    });

    const offer = await peer.getOffer();
    socket.emit("user:call", { to: socketId, offer });
    setMyStream(stream);
  }, [socketId, socket]);

  return (
    <div>
      <span>/Room : </span>
      <span>
        <button onClick={() => navigate("/")}>Home</button>
      </span>
      <h3>{socketId ? "Connected" : "No one in the room"}</h3>
      {socketId && <button onClick={handleCallUser}>Call</button>}
      {mySteam && (
        <>
          <h4>My video</h4>
          <ReactPlayer
            muted
            playing
            width="100px"
            height="200px"
            url={mySteam}
          />
        </>
      )}
    </div>
  );
};

export default Room;
