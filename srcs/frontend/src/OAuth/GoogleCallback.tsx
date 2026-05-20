import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import host from "../api/host";
import { setLoggedIn } from "../api/login_status";

export function GoogleCallback() {
  const navigate = useNavigate();

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
        navigate("/profile");
      } catch (err) {
		// improve with set state
        console.error("Google login failed:", err);
        navigate("/login");
      }
    }

    GoogleLogin();
  }, [navigate]);

  return <p>Logging in...</p>;
}