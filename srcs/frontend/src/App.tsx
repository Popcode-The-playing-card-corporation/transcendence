import { BrowserRouter, Route, Routes } from "react-router";
import { Home } from "./pages/Home";
import { Game } from "./pages/Game";
import { Leaderboard } from "./pages/Leaderboard";
import { Profile } from "./pages/Profile";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/game" element={<Game />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
