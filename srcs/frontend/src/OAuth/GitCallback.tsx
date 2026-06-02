import { useEffect, useRef, type SetStateAction } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import host from "../api/http/host";
import { useNotif } from "../components/hooks/useNotif";

export function GitCallback({setLoggedIn}:{setLoggedIn:React.Dispatch<SetStateAction<boolean>>}) {
  const navigate = useNavigate();
  const location = useLocation();
  const notif = useNotif();
  const hasRun = useRef(false);

  useEffect(() => {
	if (hasRun.current) return; // I think it's just a dev problem, but to be safe
    	hasRun.current = true;

    async function gitLogin() {
      const params = new URLSearchParams(window.location.search);
      const code = params.get("code");

      if (!code) {
        navigate("/login");
        return;
      }

      try {
        await axios.post(
          host.http + 'login/github/',
          { code:code },
          { withCredentials: true }
        );
		setLoggedIn(true);
		const redirect = sessionStorage.getItem("login_redirect") || "/";
		sessionStorage.removeItem("login_redirect");
		navigate(redirect);
      } catch {
		notif?.showNotif("Login Error", "OAuth Login failed please try again.", 5000)
        navigate("/login");
      }
    }

    gitLogin();
  }, [navigate, location, setLoggedIn, notif]);

return (
	<div className="page-content flex items-center justify-center min-h-screen">
		<span className="loading loading-spinner loading-xl"></span>
	</div>
)
}