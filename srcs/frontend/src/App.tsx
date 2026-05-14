import { BrowserRouter, Route, Routes } from "react-router";
import { Home } from "./pages/Home";
import { Game } from "./pages/Game";
import { Leaderboard } from "./pages/Leaderboard";
import { Profile } from "./pages/Profile";
import { Navbar } from "./components/Navbar";
import { Settings } from "./pages/Settings";
import { Rules } from "./pages/Rules";
import { Login } from "./pages/Login";
import { Footer } from "./components/Footer";
import { PrivacyPolicy } from "./pages/PrivacyPolicy";
import { TermsOfService } from "./pages/TermsOfService";
import { Error404 } from "./pages/Error404";

function App() {

  return (
    <main className="bg-(--bg-color) font-[Cause] text-(--font-color) ContentFooterContainer flex flex-col justify-between min-h-dvh">
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/game" element={<Game />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route
            path="/profile"
            element={<Profile />}
          />
          <Route path="/settings" element={<Settings />} />
          <Route path="/rules" element={<Rules />} />
          <Route path="/login" element={<Login />} />
          <Route path="/privacyPolicy" element={<PrivacyPolicy />} />
          <Route path="/termsOfService" element={<TermsOfService />} />
          <Route path="*" element={<Error404 />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </main>
  );
}

export default App;
