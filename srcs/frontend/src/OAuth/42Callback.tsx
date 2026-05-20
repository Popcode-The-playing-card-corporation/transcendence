import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import host from "../api/host";
import { setLoggedIn } from "../api/login_status";

export function FortyTwoCallback() {
  const navigate = useNavigate();

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
        navigate("/profile");
      } catch (err) {
		// improve with set state
        console.error("42 login failed:", err);
        navigate("/login");
      }
    }

    FortyTwoLogin();
  }, [navigate]);

  return <p>Logging in...</p>;
}