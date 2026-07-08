import type { Dispatch, KeyboardEvent, SetStateAction } from "react";
import { useRef, useState } from "react";
import { loginRequest } from "../../api/http/login";
import { useLocation, useNavigate } from "react-router-dom";
import type { errorT } from "../../utils/type/errorType";
import LoginWithService from "./LoginWithService";
import { useAuth } from "../hooks/useAuth";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import type { friendT, requestT } from "../../utils/type/friendType";
import { friendArray, getFriends } from "../../api/http/friend";

export function LoginForm({
  setCreated,
}: {
  setCreated: Dispatch<SetStateAction<boolean>>;
}) {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [failure, setFailure] = useState(false);
  const [reason, setReason] = useState<errorT>({ code: 200, response: "" });
  const location = useLocation();
  const navigate = useNavigate();
  const auth = useAuth();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const nameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };
  const passChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

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

	if (location.state) {
		navigate(location.state, { state: location.pathname});
		return ;
	}
	navigate("/", {state: location.pathname})
  }

  async function loginClick() {
    setFailure(false);
    setReason({ code: 200, response: "" });

    const trimmedName = name.trim();

    if (password === "" && trimmedName.length === 0) {
		setReason({ code: -1, response: "Username and Password cannot be empty!" });
    	setFailure(true);
		return ;
	}

  const result = await loginRequest(name, password, auth.setUserID, auth.setPass);
  if (result.code == 200) {
  auth.setLoggedIn(true);
  loginSuccess();
      return;
  }
  setReason(result);
  setFailure(true);
  return;
  }

	const handleKey = (event: KeyboardEvent) => {
		if (event.key === "Enter")
      buttonRef.current?.click();
	};

  return (
    <fieldset className="fieldset bg-base-100 rounded-box w-xs p-4 mx-auto">
      <legend className="fieldset-legend">Login</legend>
      {failure ? (
        <label className="label text-error font-black mx-auto">{reason.response}</label>
      ) : (
        <div></div>
      )}
      <label className="label">Username</label>
      <input
        type="text"
        value={name}
        onChange={nameChange}
        className="input"
        placeholder="..."
        onKeyDown={handleKey}
      />

      <label className="label">Password</label>
      <div className="input">
        <input
          type={showPassword ? "text" : "password"}
          value={password} // show the password in inspector, is it okay ??
          onChange={passChange}
          placeholder="..."
          onKeyDown={handleKey}
        />
        <button className="cursor-pointer " onClick={() => setShowPassword(!showPassword)}>{showPassword ? <FaEyeSlash /> : <FaEye />}</button>
      </div>
      
      <a onClick={() => setCreated(true)} className="link-hover">
        No Account? Create one here!
      </a>

      <button
        ref={buttonRef}
        onClick={loginClick}
        className="btn btn-neutral mt-4"
      >
        Login
      </button>
	  <LoginWithService />

    </fieldset>
  );
}
