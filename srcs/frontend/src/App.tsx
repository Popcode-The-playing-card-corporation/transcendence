import { BrowserRouter, Route, Routes } from "react-router";
import { Home } from "./pages/Home";
import { Game } from "./pages/Game";
import { Leaderboard } from "./pages/Leaderboard";
import { Profile } from "./pages/Profile";

function App() {
  return (
    <BrowserRouter>
      <div className="navbar bg-base-200">
        <div className="flex-1">
          <a className="btn btn-ghost text-xl" href="/">
            PopCards
          </a>
        </div>
        <div className="flex-none">
          <ul className="menu menu-horizontal">
            <li>
              <a href="/game">Game</a>
            </li>
            <li>
              <a href="/leaderboard">Leaderboard</a>
            </li>
            <li>
              <a href="/profile">Profile</a>
            </li>
          </ul>
        </div>
      </div>
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
