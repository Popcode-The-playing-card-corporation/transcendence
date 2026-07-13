import type { Dispatch, KeyboardEvent, SetStateAction } from "react";
import { useRef, useState } from "react";
import { registerRequest } from "../../api/http/register";
import { useLocation, useNavigate } from "react-router-dom";
import type { errorT } from "../../utils/type/errorType";
import LoginWithService from "./LoginWithService";
import { useAuth } from "../hooks/useAuth";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import type { friendT, requestT } from "../../utils/type/friendType";
import { friendArray, getFriends } from "../../api/http/friend";

const avatar = "/avatars/avatar1.png";

export function RegisterForm({
  setCreated,
}: {
  setCreated: Dispatch<SetStateAction<boolean>>;
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repassword, setrePassword] = useState("");
  const [failure, setFailure] = useState(false);
  const [reason, setReason] = useState<errorT>({ code: 200, response: "" });
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState<boolean>(false);
  const [acceptConditions, setAcceptConditions] = useState<boolean>(false);

  const auth = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const emailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };
  const nameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };
  const passChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };
  const repassChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setrePassword(e.target.value);
  };

  function validate_inputs(in_email: string, in_name: string, in_pass: string, re_pass: string) {
    const emailPattern = /\w+@\w+\.\w+/;
    if (in_email.trim().length === 0 || in_name.trim().length === 0 || in_pass.length === 0 || re_pass.length === 0) {
      setReason({ code: -1, response: "All fields must be filled!" });
      return false;
    } else if (!emailPattern.test(in_email)) {
      setReason({ code: -1, response: "Please enter a valid email!" });
      return false;
    } else if (in_pass !== re_pass) {
      setReason({ code: -1, response: "Passwords do not match!" });
      return false;
    } else if (in_pass.length < 8) {
      setReason({ code: -1, response: "Password must be at least 8 characters!" })
      return false;
    } else if (!(/[A-Z]/.test(in_pass)) || !(/[a-z]/.test(in_pass)) || !/[^a-zA-Z0-9]/.test(in_pass)) {
      setReason({ code: -1, response: "Password must contain at least: 1 uppercase, 1 lowercase and 1 special character" })
      return false;
    }

    return true;
  }

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

  async function registerSuccess() {

    const friendlist = await getFriends();
    if ("code" in friendlist) {
      auth.setHasFriendRequest(false);
      return;
    }
    const arr = friendArray(friendlist);
    const filter = getRequests(arr);
    if (filter.requests.length > 0) {
      auth.setHasFriendRequest(true);
    } else {
      auth.setHasFriendRequest(false);
    }

    if (location.state) {
      navigate(location.state, { state: location.pathname });
      return;
    }
    navigate("/", { state: location.pathname });
  }

  async function registerClick() {
    setFailure(false);
    setReason({ code: 200, response: "" });
    const trimmedName = name.trim();
    const trimmedEmail = email.trim();
    if (!validate_inputs(trimmedEmail, trimmedName, password, repassword)) {
      setFailure(true);
      return;
    }

    const result = await registerRequest(trimmedEmail, trimmedName, password, repassword, avatar, auth.setUserID, auth.setPass);
    if (result.code === 200) {
      (auth.setLoggedIn(true));
      registerSuccess();
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
    <fieldset className="fieldset bg-base-100 rounded-box p-5 mx-auto w-xs max-sm:w-full">
      <legend className="fieldset-legend">Register</legend>
      {
        failure ? (
          <label className="label text-error max-md:text-wrap font-black mx-auto">{reason.response}</label>
        ) : (
          <div></div>
        )
      }
      <label className="label">Username</label>
      <input
        type="text"
        value={name}
        onChange={nameChange}
        className="input w-full"
        placeholder="..."
        onKeyDown={handleKey}
      />

      <label className="label">Email</label>
      <input
        type="email"
        value={email}
        onChange={emailChange}
        className="input w-full"
        placeholder="..."
        onKeyDown={handleKey}
      />

      <label className="label">Password</label>
      <div className="input w-full">
        <input
          type={showPassword ? "text" : "password"}
          value={password}
          onChange={passChange}
          placeholder="..."
          onKeyDown={handleKey}
        />
        <button className="cursor-pointer " onClick={() => setShowPassword(!showPassword)}>{showPassword ? <FaEyeSlash /> : <FaEye />}</button>
      </div>

      <label className="label">Confirm password</label>
      <div className="input w-full">
        <input
          type={showPasswordConfirm ? "text" : "password"}
          value={repassword}
          onChange={repassChange}
          placeholder="..."
          onKeyDown={handleKey}
        />
        <button className="cursor-pointer " onClick={() => setShowPasswordConfirm(!showPasswordConfirm)}>{showPasswordConfirm ? <FaEyeSlash /> : <FaEye />}</button>
      </div>

      <a onClick={() => setCreated(false)} className="link-hover">
        Already an account? Go login here!
      </a>

      <div className="w-full">
        <label className="label">
          <input type="checkbox" checked={acceptConditions} className="checkbox" onChange={() => setAcceptConditions(!acceptConditions)} />
          <p className="text-wrap">
            I agree to the <a className="link" href="/PrivacyPolicy">Privacy Policy</a> and <a className="link" href="/TermsOfService">Terms of service</a>
          </p>
        </label>
      </div>

      <button
        ref={buttonRef}
        disabled={!acceptConditions}
        onClick={registerClick}
        className="btn btn-neutral mt-4"
      >
        Register
      </button>
      <LoginWithService />
    </fieldset >
  );
}
