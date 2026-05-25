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
import { NotifPopUp } from "./components/NotifPopUp";
import { PrivacyPolicy } from "./pages/PrivacyPolicy";
import { TermsOfService } from "./pages/TermsOfService";
import Error404 from "./pages/Error404";
import { GoogleCallback } from "./OAuth/GoogleCallback";
import { FortyTwoCallback } from "./OAuth/42Callback";
import { GitCallback } from "./OAuth/GitCallback";
import { Presence } from "./websockets/presence";

function App() {
  return (
    <main className="bg-(--bg-color) font-[Cause] text-(--font-color) ContentFooterContainer flex flex-col justify-between min-h-dvh">
	  <Presence />
      <BrowserRouter>
        <Navbar />
        <NotifPopUp
          isEnabled={false}
          title="Tu es seul"
          body="Et tu dois l'accepter"
        />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/game" element={<Game />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/rules" element={<Rules />} />
          <Route path="/login" element={<Login />} />
          <Route path="/privacyPolicy" element={<PrivacyPolicy />} />
          <Route path="/termsOfService" element={<TermsOfService />} />
		  <Route path="/login/google/callback" element={<GoogleCallback />} />
		  <Route path="/login/42/callback" element={<FortyTwoCallback />} />
		  <Route path="/login/github/callback" element={<GitCallback />} />
          <Route path="*" element={<Error404 />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </main>
  );
}

export default App;
