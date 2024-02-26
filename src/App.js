import "./App.css";
import { Routes, Route } from "react-router-dom";
import LobbyScreen from "./screen/Lobby";
import Room from "./screen/Room";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<LobbyScreen />} />
        <Route path="/room/:id" element={<Room />} />
      </Routes>
    </div>
  );
}

export default App;
