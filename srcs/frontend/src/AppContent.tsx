import { BrowserRouter, Route, Routes } from "react-router";
import { Home } from "./pages/Home";
import { Game } from "./pages/Game";
import { Leaderboard } from "./pages/Leaderboard";
import { Profile } from "./pages/Profile";
import { Navbar } from "./components/utils/Navbar";
import { Settings } from "./pages/Settings";
import { Rules } from "./pages/Rules";
import { Login } from "./pages/Login";
import { Footer } from "./components/utils/Footer";
import { NotifPopUp } from "./components/utils/NotifPopUp";
import { PrivacyPolicy } from "./pages/PrivacyPolicy";
import { TermsOfService } from "./pages/TermsOfService";
import Error404 from "./pages/Error404";
import { GoogleCallback } from "./OAuth/GoogleCallback";
import { FortyTwoCallback } from "./OAuth/42Callback";
import { GitCallback } from "./OAuth/GitCallback";
import { useState } from "react";
import { Presence } from "./api/websockets/presence";
import { Notifications } from "./api/websockets/notifcations";
import { useAuth } from "./components/hooks/useAuth";

function AppContent({setFontChoice}:{setFontChoice:React.Dispatch<React.SetStateAction<string>>}) {
  const [updatedProfile, setProfile] = useState(false);
  const [updateLeaderboard, setLeaderboard] = useState(false);
  const [isGamePage, setIsGamePage] = useState<boolean>(false)

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
		  {!isGamePage ? <Notifications setProfile={setProfile} updatedProfile={updatedProfile} updateLeaderboard={updateLeaderboard} setLeaderboard={setLeaderboard}/> : <></>}
		  {!isGamePage ? <Navbar /> : <></>}
          <NotifPopUp />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/game" element={<Game setIsGamePage={setIsGamePage} />} />
            <Route path="/leaderboard" element={<Leaderboard updateLeaderboard={updateLeaderboard} />} />
            <Route path="/profile" element={<Profile setUpdate={setProfile} updatedProfile={updatedProfile} />} />
            <Route
              path="/settings"
              element={<Settings setFontChoice={setFontChoice} />}
            />
            <Route path="/rules" element={<Rules />} />
            <Route path="/login" element={<Login />} />
            <Route path="/privacyPolicy" element={<PrivacyPolicy />} />
            <Route path="/termsOfService" element={<TermsOfService />} />
            <Route path="/login/google/callback" element={<GoogleCallback />} />
            <Route path="/login/42/callback" element={<FortyTwoCallback />} />
            <Route path="/login/github/callback" element={<GitCallback />} />
            <Route path="*" element={<Error404 />} />
          </Routes>
		  { !isGamePage ? <Footer /> : <></>}
        </BrowserRouter>
  );
}

export default AppContent;
