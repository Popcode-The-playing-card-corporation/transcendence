import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import host from "../api/host";
import { setLoggedIn } from "../api/login_status";

export function GitCallback() {
  const navigate = useNavigate();

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
        navigate("/profile");
      } catch (err) {
		// improve with set state
        console.error("GitHub login failed:", err);
        navigate("/login");
      }
    }

    GitLogin();
  }, [navigate]);

  return <p>Logging in...</p>;
}