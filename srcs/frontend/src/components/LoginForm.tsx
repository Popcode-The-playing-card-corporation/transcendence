import type { Dispatch, SetStateAction } from "react";
import { useState, useEffect } from "react";
import { loginRequest } from '../api/login'
import { useNavigate } from "react-router-dom";
import { checkAuth } from "../api/checkAuth";


export function LoginForm( {setCreated}: {setCreated : Dispatch<SetStateAction<boolean>>}) {


	const [name,setName] = useState("");
	const [password,setPassword] = useState("");
	const [success, setSuccess] = useState(false);
	const [failure, setFailure] = useState(false);
	const [access, setAccess] = useState(false);
	const navigate = useNavigate();
	const nameChange = (e: React.ChangeEvent<HTMLInputElement>) => {setName(e.target.value);};
	const passChange = (e: React.ChangeEvent<HTMLInputElement>) => {setPassword(e.target.value);};

	async function loginClick() {
		setSuccess(false);
		setFailure(false);
		if (password !== "" && name !== "") {
			const result = await loginRequest(name, password);
			if (result) {
				localStorage.setItem('access', result.access);
				localStorage.setItem('refresh', result.refresh);
				setFailure(false);
				setSuccess(true);
				return ;
			}
			setSuccess(false);
			setFailure(true);
			return ;
		}
		setFailure(true);
		return ;
	}

	async function checkAccess() {
		const authed = await checkAuth();
		if (authed) {
			setAccess(true);
			return ;
		}
		setAccess(false);
		return ;
	}

	useEffect(() => {
		checkAccess();
	}, [])


	if (success || access) {
		navigate('/profile')
	}

  return (
    <fieldset className="fieldset bg-(--bg-color) border-(--accent-color) rounded-box w-xs border p-4 mx-auto">
      <legend className="fieldset-legend">Login</legend>
	  {failure ? <label className="label">Login Failure!</label>: <div></div> }
      <label className="label">Username</label>
      <input type="text" value={name} onChange={nameChange} className="input" placeholder="Username" />

      <label className="label">Password</label>
      <input type="password" value={password} onChange={passChange} className="input" placeholder="Password" />
	  <a onClick={() => setCreated(true)} className="link-hover">No Account? Create one here!</a>

      <button onClick={loginClick} className="btn btn-neutral mt-4 bg-(--nav-color)">Login</button>
    </fieldset>
  );
}
