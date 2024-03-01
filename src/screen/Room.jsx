import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useSocket } from "../context/SocketProvider";
import ReactPlayer from "react-player";
import peer from "../service/peer";

const Room = () => {
  const [socketId, setSocketId] = useState(null);
  const [mySteam, setMyStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const navigate = useNavigate();
  const socket = useSocket();

  // user joined the room
  const handleUserJoined = useCallback(({ email, id }) => {
    console.log(`Email - ${email} joined the room.`);
    setSocketId(id);
  }, []);

  // calling the user
  const handleCallUser = useCallback(async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: true,
    });

    const offer = await peer.getOffer();
    socket.emit("user:call", { to: socketId, offer });
    setMyStream(stream);
  }, [socketId, socket]);

  // incoming call
  const handleIncomingCall = useCallback(
    async ({ from, offer }) => {
      console.log(`Incoming call from : ${from}`, offer);

      // setting remote socket id of the requested call user
      setSocketId(from);

      // turning on the user's stream
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: true,
      });
      setMyStream(stream);

      const ans = await peer.getAnswer(offer);
      socket.emit("call:accepted", { to: from, ans });
    },
    [socket]
  );

  // send stream to the user
  const sendStream = useCallback(() => {
    for (const track of mySteam.getTracks()) {
      peer.peer.addTrack(track, mySteam);
    }
  }, [mySteam]);

  // call accepted
  const handleCallAccepted = useCallback(
    ({ from, ans }) => {
      peer.setLocalDescription(ans);
      console.log("call accepted");
      sendStream();
    },
    [sendStream]
  );

  // negotiation needed
  const negotiationneeded = useCallback(async () => {
    const offer = await peer.getOffer();
    socket.emit("peer:nego:needed", { to: socketId, offer });
  }, [socket, socketId]);

  // negotiation incoming
  const handleNegotiationIncoming = useCallback(
    async ({ from, offer }) => {
      console.log(`Negotiation needed from ${from}`);
      const ans = await peer.getAnswer(offer);
      socket.emit("peer:nego:done", { to: from, ans });
    },
    [socket]
  );

  // negotiation final
  const handleNegotiationFinal = useCallback(async ({ ans }) => {
    await peer.setLocalDescription(ans);
  }, []);

  // all the socket events
  useEffect(() => {
    socket.on("room:joined", handleUserJoined);
    socket.on("incoming:call", handleIncomingCall);
    socket.on("call:accpeted", handleCallAccepted);
    socket.on("peer:nego:needed", handleNegotiationIncoming);
    socket.on("peer:nego:final", handleNegotiationFinal);

    return () => {
      socket.off("room:joined", handleUserJoined);
      socket.off("incoming:call", handleIncomingCall);
      socket.off("call:accpeted", handleCallAccepted);
      socket.off("peer:nego:needed", handleNegotiationIncoming);
      socket.off("peer:nego:final", handleNegotiationFinal);
    };
  }, [
    socket,
    handleUserJoined,
    handleIncomingCall,
    handleCallAccepted,
    handleNegotiationIncoming,
    handleNegotiationFinal,
  ]);

  // adding negotiation needed
  useEffect(() => {
    peer.peer.addEventListener("negotiationneeded", negotiationneeded);

    return () => {
      peer.peer.removeEventListener("negotiationneeded", negotiationneeded);
    };
  }, [negotiationneeded, socket, socketId]);

  // adding tracks and setting the remote stream
  useEffect(() => {
    peer.peer.addEventListener("track", async (ev) => {
      const remoteStream = ev.streams;
      setRemoteStream(remoteStream[0]);
    });
  }, []);

  return (
    <div>
      <span>/Room : </span>
      <span>
        <button onClick={() => navigate("/")}>Home</button>
      </span>
      {mySteam && <button onClick={sendStream}>Send stream</button>}
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
      {remoteStream && (
        <>
          <h4>Remote Stream</h4>
          <ReactPlayer
            muted
            playing
            width="100px"
            height="200px"
            url={remoteStream}
          />
        </>
      )}
    </div>
  );
};

export default Room;
