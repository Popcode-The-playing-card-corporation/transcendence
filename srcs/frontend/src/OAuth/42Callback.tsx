import { useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import host from "../api/http/host";
import { useNotif } from "../components/hooks/useNotif";
import { useAuth } from "../components/hooks/useAuth";
import type { friendT, requestT } from "../utils/type/friendType";
import { friendArray, getFriends } from "../api/http/friend";


export function FortyTwoCallback() {
  const navigate = useNavigate();
  const location = useLocation();
  const notif = useNotif();
  const auth = useAuth();
  const hasRun = useRef(false);


   function getRequests(friend_list: friendT[]): {
	friends: friendT[];
	requests: requestT[];
	} {
	const friends: friendT[] = [];
	const requests: requestT[] = [];
  
	for (const friend of friend_list) {
		if (friend.can_accept) {
		requests.push({ id: friend.id, username: friend.user.username });
		} else {
		friends.push(friend);
		}
	}
	return { friends: friends, requests: requests };
  }

  async function loginSuccess() {

	const friendlist = await getFriends();
	if ("code" in friendlist) {
		auth.setHasFriendRequest(false);
		return ;
	}
	const arr = friendArray(friendlist);
	const filter = getRequests(arr);
	if (filter.requests.length > 0) {
		auth.setHasFriendRequest(true);
	} else {
		auth.setHasFriendRequest(false);
	}

  }

  useEffect(() => {
	if (hasRun.current) return;
    	hasRun.current = true;

    async function FortyTwoLogin() {
      const params = new URLSearchParams(window.location.search);
      const code = params.get("code");

      if (!code) {
        navigate("/login");
        return;
      }

      try {
        const res = await axios.post(
          host.http + 'login/42/',
          { code:code },
          { withCredentials: true }
        );
		auth.setUserID(res.data.id);
		auth.setPass(res.data.has_pass);
		auth.setLoggedIn(true);
		const redirect = sessionStorage.getItem("login_redirect") || "/";
		sessionStorage.removeItem("login_redirect");
		loginSuccess();
		navigate(redirect);
      } catch {
		notif?.showNotif("Login Error", "OAuth Login failed please try again.", 5000)
        navigate("/login");
      }
    }

    FortyTwoLogin();
  }, [navigate, location, auth, auth.setLoggedIn, notif]);

return (
	<div className="page-content flex items-center justify-center min-h-screen">
		<span className="loading loading-spinner loading-xl"></span>
	</div>
)
}