import React, { useCallback, useState } from "react";

const LobbyScreen = () => {
  const [email, setEmail] = useState("");
  const [room, setRoom] = useState("");

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();
      console.log({ email, room });
    },
    [email, room]
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
