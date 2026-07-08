import { useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import host from "../api/http/host";
import { useNotif } from "../components/hooks/useNotif";
import { useAuth } from "../components/hooks/useAuth";

export function GoogleCallback() {
  const navigate = useNavigate();
  const auth = useAuth();
  const location = useLocation();
  const notif = useNotif();
  const hasRun = useRef(false);

  useEffect(() => {
	if (hasRun.current) return;
    	hasRun.current = true;

    async function GoogleLogin() {
      const params = new URLSearchParams(window.location.search);
      const code = params.get("code");

      if (!code) {
        navigate("/login");
        return;
      }

      try {
        const res = await axios.post(
          host.http + 'login/google/',
          { code:code },
          { withCredentials: true }
        );
		auth.setUserID(res.data.id);
		auth.setPass(res.data.has_pass);
		auth.setLoggedIn(true);
		const redirect = sessionStorage.getItem("login_redirect") || "/";
		sessionStorage.removeItem("login_redirect");		
		navigate(redirect);
      } catch {
		notif?.showNotif("Login Error", "OAuth Login failed please try again.", 5000)
        navigate("/login");
      }
    }

    GoogleLogin();
  }, [navigate, location, auth.setLoggedIn, notif, auth]);

return (
	<div className="page-content flex items-center justify-center min-h-screen">
		<span className="loading loading-spinner loading-xl"></span>
	</div>
)
}