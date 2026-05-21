import type { Dispatch, SetStateAction } from "react";
import { useState, useEffect } from "react";
import { registerRequest } from "../api/register";
import { useLocation, useNavigate } from "react-router-dom";
import { checkAuth } from "../api/checkAuth";
import avatar from "../assets/avatars/avatar1.png";
import type { errorT } from "../utils/errorType";
import LoginWithService from "./LoginWithService";

export function RegisterForm({
  setCreated,
}: {
  setCreated: Dispatch<SetStateAction<boolean>>;
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repassword, setrePassword] = useState("");
  const [success, setSuccess] = useState(false);
  const [failure, setFailure] = useState(false);
  const [access, setAccess] = useState(false);
  const [reason, setReason] = useState<errorT>({code:200, response:""});
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

  function validate_inputs(in_email:string, in_name:string, in_pass:string, re_pass:string) {
	const emailPattern = /\w+@\w+\.\w+/;
	if (in_email.trim().length === 0 || in_name.trim().length === 0 || in_pass.length === 0 || re_pass.length === 0) {
		setReason({code: -1, response: "All fields must be filled!"});
		return false;
	} else if (!emailPattern.test(in_email)) {
		setReason({code: -1, response: "Please enter a valid email!"});
		return false;
	} else if (in_pass !== re_pass){
		setReason({code: -1, response: "Passwords do not match!"});
		return false;
	} else if (in_pass.length < 8) {
		setReason({code: -1, response: "Password must be at least 8 characters!"})
		return false;
	} else if (!(/[A-Z]/.test(in_pass)) || !(/[a-z]/.test(in_pass)) || !/[^a-zA-Z0-9]/.test(in_pass)) {
		setReason({code: -1, response: "Password must contain at least: 1 uppercase, 1 lowercase and 1 special character"})
		return false;
	}

	return true;
  }

  async function registerClick() {
    setSuccess(false);
    setFailure(false);
	setReason({code:200, response:""});
	setName(name.trim());
	setEmail(email.trim());
    if (validate_inputs(email, name, password, repassword)) {
      const result = await registerRequest(email, name, password, avatar);
      if (!('code' in result)) {
        setSuccess(true);
        return;
      }
	  setReason(result);
      setSuccess(false);
      setFailure(true);
      return;
    }
    setFailure(true);
    return;
  }


  useEffect(() => {
	async function checkAccess() {
		const authed = await checkAuth();
		if (authed) {
		setAccess(true);
		return;
		}
		setAccess(false);
		return;
  	}

    checkAccess();

	if (success || access) {
		if (location.state) {
			navigate(location.state);
			return ;
		}
		navigate('/');
		return ;
	}
  }, [navigate, success, access, location]);


  return (
    <fieldset className="fieldset bg-(--bg-color) border-(--accent-color) rounded-box w-xs border p-4 mx-auto">
      <legend className="fieldset-legend">Register</legend>
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

      <label className="label">Email</label>
      <input
        type="email"
        value={email}
        onChange={emailChange}
        className="input"
        placeholder="Email"
      />

      <label className="label">Password</label>
      <input
        type="password"
        value={password}
        onChange={passChange}
        className="input"
        placeholder="Password"
      />

      <label className="label">Confirm password</label>
      <input
        type="password"
        value={repassword}
        onChange={repassChange}
        className="input"
        placeholder="Password, again"
      />

      <a onClick={() => setCreated(false)} className="link-hover">
        Already an account? Go login here!
      </a>

      <button
        onClick={registerClick}
        className="btn btn-neutral mt-4 bg-(--nav-color)"
      >
        Register
      </button>
      <LoginWithService />
    </fieldset>
  );
}
