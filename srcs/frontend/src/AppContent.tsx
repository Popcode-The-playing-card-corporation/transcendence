import { BrowserRouter, Route, Routes } from "react-router";
import { Home } from "./pages/Home";
import { Game } from "./pages/Game";
import { Leaderboard } from "./pages/Leaderboard";
import { Achievements } from "./pages/Achievements";
import { Profile } from "./pages/Profile";
import { Navbar } from "./components/utils/Navbar";
import { Settings } from "./pages/Settings";
import { Rules } from "./pages/Rules";
import { Login } from "./pages/Login";
import { Footer } from "./components/utils/Footer";
import { NotifPopUp } from "./components/utils/NotifPopUp";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import { TermsOfService } from "./pages/TermsOfService";
import Error404 from "./pages/Error404";
import { GoogleCallback } from "./OAuth/GoogleCallback";
import { FortyTwoCallback } from "./OAuth/42Callback";
import { GitCallback } from "./OAuth/GitCallback";
import { useState } from "react";
import { Presence } from "./api/websockets/presence";
import { Notifications } from "./api/websockets/notifcations";
import { useAuth } from "./components/hooks/useAuth";
import PrivateRoute from "./utils/routing/PrivateRoutes";

function AppContent({ setFontChoice }: { setFontChoice: React.Dispatch<React.SetStateAction<string>> }) {
  const [updatedProfile, setProfile] = useState(false);
  const [updateLeaderboard, setLeaderboard] = useState(false);

  const auth = useAuth();

  if (auth.logging || auth.logged_in === null) {
    return (
      <div className="page-content flex items-center justify-center min-h-screen">
        <span className="loading loading-spinner loading-xl"></span>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Presence />
      <Notifications setProfile={setProfile} updatedProfile={updatedProfile} updateLeaderboard={updateLeaderboard} setLeaderboard={setLeaderboard} />
      {auth.in_game ? null : <Navbar />}
      <NotifPopUp />
      <Routes>
        <Route path="/game" element={<PrivateRoute> <Game /> </PrivateRoute>} />
        <Route path="/profile" element={<PrivateRoute>  <Profile setUpdate={setProfile} updatedProfile={updatedProfile} /> </PrivateRoute>} />
        <Route path="/" element={<Home updatedProfile={updatedProfile} setUpdate={setProfile} />} />
        <Route path="/leaderboard" element={<Leaderboard updateLeaderboard={updateLeaderboard} />} />
        <Route path="/achievements" element={<Achievements updateLeaderboard={updateLeaderboard} />} />
        <Route
          path="/settings"
          element={<Settings setFontChoice={setFontChoice} />}
        />
        <Route path="/rules" element={<Rules />} />
        <Route path="/login" element={<Login />} />
        <Route path="/privacyPolicy" element={< PrivacyPolicy />} />
        <Route path="/termsOfService" element={<TermsOfService />} />
        <Route path="/login/google/callback" element={<GoogleCallback />} />
        <Route path="/login/42/callback" element={<FortyTwoCallback />} />
        <Route path="/login/github/callback" element={<GitCallback />} />
        <Route path="*" element={<Error404 />} />
      </Routes>
      {auth.in_game ? null : <Footer />}
    </BrowserRouter>
  );
}

export default AppContent;
