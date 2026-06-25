import type { Dispatch, KeyboardEvent, SetStateAction } from "react";
import { useRef, useState } from "react";
import { loginRequest } from "../../api/http/login";
import { useLocation, useNavigate } from "react-router-dom";
import type { errorT } from "../../utils/type/errorType";
import LoginWithService from "./LoginWithService";
import { useAuth } from "../hooks/useAuth";

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

  const nameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };
  const passChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  function loginSuccess() {
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
      <input
        type="password"
        value={password}
        onChange={passChange}
        className="input"
        placeholder="..."
        onKeyDown={handleKey}
      />
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
