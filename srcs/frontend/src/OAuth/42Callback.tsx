import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import host from "../api/host";
import { setLoggedIn } from "../api/login_status";

export function FortyTwoCallback() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    async function FortyTwoLogin() {
      const params = new URLSearchParams(window.location.search);
      const code = params.get("code");

      if (!code) {
        navigate("/login");
        return;
      }

      try {
        await axios.post(
          host.http + 'login/42/',
          { code:code },
          { withCredentials: true }
        );
		setLoggedIn(true);
		if (location.state) {
        	navigate(location.state);
		} else {
			navigate("/", {state: location.pathname});
		}// Improve same functioning as normal login
      } catch (err) {
		// improve with set state
        console.error("42 login failed:", err);
        navigate("/login");
      }
    }

    FortyTwoLogin();
  }, [navigate, location]);

return (
	<div className="page-content flex items-center justify-center min-h-screen">
		<span className="loading loading-spinner loading-xl"></span>
	</div>
)
}