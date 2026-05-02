import { BrowserRouter, Route, Routes } from "react-router";
import { Home } from "./pages/Home";
import { Game } from "./pages/Game";
import { Leaderboard } from "./pages/Leaderboard";
import { Profile } from "./pages/Profile";
import { Navbar } from "./components/Navbar";
import { Settings } from "./pages/Settings";
import { Rules } from "./pages/Rules";
import { Login } from "./pages/Login";
import { generateFakeAccount } from "./utils/generateTestAccount";
const current_account = generateFakeAccount();

function App() {
  return (
    <main className="bg-(--bg-color) font-[Cause] text-(--font-color) h-full">
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/game" element={<Game />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/profile" element={<Profile accountCurr={current_account}/>} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/rules" element={<Rules />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </BrowserRouter>
    </main>
  );
}

export default App;
