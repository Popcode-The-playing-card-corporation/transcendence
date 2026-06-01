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
import { useEffect, useState } from "react";
import NotifProvider from "./components/contexts/NotifContext";
import { Presence } from "./websockets/presence";
import { Notifications } from "./websockets/notifcations";
import { checkAuth } from "./api/checkAuth";

function App() {
  const [fontChoice, setFontChoice] = useState("font-Cause");
  const [logged_in, setLogged] = useState(false);
  const [logging, setLogging] = useState(false);
  const [authChecked, setChecked] = useState(false);
  const [updatedProfile, setProfile] = useState(false);
  const [updateLeaderboard, setLeaderboard] = useState(false);

  useEffect(() => {
	if (logging) {
		return ;
	}

	async function getAuth() {
		const authed = await checkAuth();
		setLogged(authed);
		setChecked(true);
	}

	getAuth();
  }, [logging]);

  if (!authChecked && !logging) {
	return (
	<div className="page-content flex items-center justify-center min-h-screen">
		<span className="loading loading-spinner loading-xl"></span>
	</div>
	);
  }

  return (
    <NotifProvider>
      <main
        className={
          "bg-(--bg-color) text-(--font-color) ContentFooterContainer flex flex-col justify-between min-h-dvh " +
          fontChoice
        }
      >
        <BrowserRouter>
		  <Presence loggedIn={logged_in} />
		  <Notifications loggedIn={logged_in} setProfile={setProfile} updatedProfile={updatedProfile} updateLeaderboard={updateLeaderboard} setLeaderboard={setLeaderboard}/>
          <Navbar logged_in={logged_in} setLoggedIn={setLogged} setLogging={setLogging}/>
          <NotifPopUp />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/game" element={<Game logged_in={logged_in} logging={logging}/>} />
            <Route path="/leaderboard" element={<Leaderboard logged_in={logged_in}  updateLeaderboard={updateLeaderboard} />} />
            <Route path="/profile" element={<Profile logged_in={logged_in} logging={logging} setUpdate={setProfile} updatedProfile={updatedProfile} />} />
            <Route
              path="/settings"
              element={<Settings islogged={logged_in}  setFontChoice={setFontChoice} />}
            />
            <Route path="/rules" element={<Rules />} />
            <Route path="/login" element={<Login loggedIn={logged_in} setLoggedIn={setLogged}/>} />
            <Route path="/privacyPolicy" element={<PrivacyPolicy />} />
            <Route path="/termsOfService" element={<TermsOfService />} />
            <Route path="/login/google/callback" element={<GoogleCallback setLoggedIn={setLogged}/>} />
            <Route path="/login/42/callback" element={<FortyTwoCallback setLoggedIn={setLogged}/>} />
            <Route path="/login/github/callback" element={<GitCallback setLoggedIn={setLogged}/>} />
            <Route path="*" element={<Error404 />} />
          </Routes>
          <Footer />
        </BrowserRouter>
      </main>
    </NotifProvider>
  );
}

export default App;
