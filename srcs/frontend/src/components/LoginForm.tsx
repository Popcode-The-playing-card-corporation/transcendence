import type { Dispatch, SetStateAction } from "react";
import { useState, useEffect } from "react";
import { loginRequest } from '../api/login'
import { useLocation, useNavigate } from "react-router-dom";
import { checkAuth } from "../api/checkAuth";
import type { errorT } from "../utils/errorType";
import { setLoggedIn } from "../api/login_status";

export function LoginForm( {setCreated}: {setCreated : Dispatch<SetStateAction<boolean>>}) {


	const [name,setName] = useState("");
	const [password,setPassword] = useState("");
	const [success, setSuccess] = useState(false);
	const [failure, setFailure] = useState(false);
	const [access, setAccess] = useState(false);
	const [reason, setReason] = useState<errorT>({code:200, response:""});
	const location = useLocation();
	const navigate = useNavigate();
	const nameChange = (e: React.ChangeEvent<HTMLInputElement>) => {setName(e.target.value);};
	const passChange = (e: React.ChangeEvent<HTMLInputElement>) => {setPassword(e.target.value);};

	async function loginClick() {
		setSuccess(false);
		setFailure(false);
		setReason({code:200, response:""});
		setName(name.trim());
		if (password !== "" && name.trim().length !== 0) {
			const result = await loginRequest(name, password);
			if (result.code == 200) {
				setFailure(false);
				setSuccess(true);
				return ;
			}
			setReason(result);
			setSuccess(false);
			setFailure(true);
			return ;
		}
		setReason({code:-1, response:"Username and Password cannot be empty!"})
		setFailure(true);
		return ;
	}

	useEffect(() => {
		async function checkAccess() {
		const authed = await checkAuth();
		if (authed) {
			setAccess(true);
			return ;
		}
		setAccess(false);
		return ;
		}

		checkAccess();

		if (success || access) {
			setLoggedIn(true);
			if (location.state) {
				navigate(location.state);
				return ;
			}
			navigate('/');
			return ;
		}
	}, [access, navigate, success, location])




  return (
    <fieldset className="fieldset bg-(--bg-color) border-(--accent-color) rounded-box w-xs border p-4 mx-auto">
      <legend className="fieldset-legend">Login</legend>
	  {failure ? <label className="label">{reason.response}</label>: <div></div> }
      <label className="label">Username</label>
      <input type="text" value={name} onChange={nameChange} className="input" placeholder="Username" />

      <label className="label">Password</label>
      <input type="password" value={password} onChange={passChange} className="input" placeholder="Password" />
	  <a onClick={() => setCreated(true)} className="link-hover">No Account? Create one here!</a>

      <button onClick={loginClick} className="btn btn-neutral mt-4 bg-(--nav-color)">Login</button>
    </fieldset>
  );
}
