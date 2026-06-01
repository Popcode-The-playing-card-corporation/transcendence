import type { Dispatch, SetStateAction } from "react";
import { useState } from "react";
import { loginRequest } from "../api/login";
import { useLocation, useNavigate } from "react-router-dom";
import type { errorT } from "../utils/errorType";
import LoginWithService from "./LoginWithService";

export function LoginForm({
  setCreated,
  setLoggedIn,
}: {
  setCreated: Dispatch<SetStateAction<boolean>>;
  setLoggedIn: React.Dispatch<SetStateAction<boolean>>;
}) {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [failure, setFailure] = useState(false);
  const [reason, setReason] = useState<errorT>({ code: 200, response: "" });
  const location = useLocation();
  const navigate = useNavigate();

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

    const result = await loginRequest(name, password);
    if (result.code == 200) {
		setLoggedIn(true);
		loginSuccess();
        return;
    }
    setReason(result);
    setFailure(true);
    return;
    }



  return (
    <fieldset className="fieldset bg-(--bg-color) border-(--accent-color) rounded-box w-xs border p-4 mx-auto">
      <legend className="fieldset-legend">Login</legend>
      {failure ? (
        <label className="label">{reason.response}</label>
      ) : (
        <div></div>
      )}
      <label className="label">Username</label>
      <input
        type="text"
        value={name}
        onChange={nameChange}
        className="input"
        placeholder="Username"
      />

      <label className="label">Password</label>
      <input
        type="password"
        value={password}
        onChange={passChange}
        className="input"
        placeholder="Password"
      />
      <a onClick={() => setCreated(true)} className="link-hover">
        No Account? Create one here!
      </a>

      <button
        onClick={loginClick}
        className="btn btn-neutral mt-4 bg-(--nav-color)"
      >
        Login
      </button>
	  <LoginWithService />

    </fieldset>
  );
}
