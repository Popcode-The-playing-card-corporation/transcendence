import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import host from "../api/host";
import { setLoggedIn } from "../api/login_status";

export function GitCallback() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    async function GitLogin() {
      const params = new URLSearchParams(window.location.search);
      const code = params.get("code");

      if (!code) {
        navigate("/login");
        return;
      }

      try {
        await axios.post(
          host.http + 'login/github/',
          { code },
          { withCredentials: true }
        );
		setLoggedIn(true);
		if (location.state) {
        	navigate(location.state, {state: location.pathname});
		} else {
			navigate("/");
		}
      } catch (err) {
		// improve with set state
        console.error("GitHub login failed:", err);
        navigate("/login");
      }
    }

    GitLogin();
  }, [navigate, location]);

return (
	<div className="page-content flex items-center justify-center min-h-screen">
		<span className="loading loading-spinner loading-xl"></span>
	</div>
)
}