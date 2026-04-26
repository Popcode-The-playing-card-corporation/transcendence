import { BrowserRouter, Route, Routes } from "react-router";
import { Home } from "./pages/Home";
import { Game } from "./pages/Game";
import { Leaderboard } from "./pages/Leaderboard";
import { Profile } from "./pages/Profile";
import { Navbar } from "./components/Navbar";
import { Settings } from "./pages/Settings";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/game" element={<Game />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/profile" element={<Profile />} />
		<Route path="/settings" element={< Settings />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
