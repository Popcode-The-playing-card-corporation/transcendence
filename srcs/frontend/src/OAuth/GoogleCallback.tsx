import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import host from "../api/host";
import { setLoggedIn } from "../api/login_status";

export function GoogleCallback() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    async function GoogleLogin() {
      const params = new URLSearchParams(window.location.search);
      const code = params.get("code");

      if (!code) {
        navigate("/login");
        return;
      }

      try {
        await axios.post(
          host.http + 'login/google/',
          { code },
          { withCredentials: true }
        );
		setLoggedIn(true);

		if (location.state) {
        	navigate(location.state);
		} else {
			navigate("/");
		}
      } catch (err) {
		// improve with set state
        console.error("Google login failed:", err); // notification popup
        navigate("/login", {state: location.pathname});
      }
    }

    GoogleLogin();
  }, [navigate, location]);

return (
	<div className="page-content flex items-center justify-center min-h-screen">
		<span className="loading loading-spinner loading-xl"></span>
	</div>
)
}