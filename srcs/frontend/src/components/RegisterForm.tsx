import type { Dispatch, SetStateAction } from "react";
import { useState } from "react";
import { registerRequest } from '../api/register'
import { useNavigate } from "react-router-dom";

export function RegisterForm({
  setCreated,
}: {
  setCreated: Dispatch<SetStateAction<boolean>>;
}) {

	const [name,setName] = useState("");
	const [email,setEmail] = useState("");
	const [password,setPassword] = useState("");
	const [repassword,setrePassword] = useState("");
	const [success, setSuccess] = useState(false);
	const [failure, setFailure] = useState(false);
	const navigate = useNavigate();
	const emailChange = (e: React.ChangeEvent<HTMLInputElement>) => {setEmail(e.target.value);};
	const nameChange = (e: React.ChangeEvent<HTMLInputElement>) => {setName(e.target.value);};
	const passChange = (e: React.ChangeEvent<HTMLInputElement>) => {setPassword(e.target.value);};
	const repassChange = (e: React.ChangeEvent<HTMLInputElement>) => {setrePassword(e.target.value);};


	async function registerClick() {
		setSuccess(false);
		setFailure(false);
		if (email !== "" && password !== "" && name !== "" && password === repassword) {
			const result = await registerRequest(email, name, password, "");
			if (result) {
				localStorage.setItem('access', result.access);
				localStorage.setItem('refresh', result.refresh);
				setSuccess(true);
				return ;
			}
			setSuccess(false);
		}
	}

	if (success) {
		navigate('/profile')
	}
	
  return (
    <fieldset className="fieldset bg-(--bg-color) border-(--accent-color) rounded-box w-xs border p-4 mx-auto">
      <legend className="fieldset-legend">Register</legend>
	  {failure ? <label className="label">Login Failure!</label>: <div></div> } // to improve.
      <label className="label">Username</label>
      <input type="text" value={name} onChange={nameChange} className="input" placeholder="Username" />

      <label className="label">Email</label>
      <input type="email" value={email} onChange={emailChange} className="input" placeholder="Email" />

      <label className="label">Password</label>
      <input type="password" value={password} onChange={passChange} className="input" placeholder="Password" />

      <label className="label">Confirm password</label>
      <input type="password" value={repassword} onChange={repassChange} className="input" placeholder="Password, again" />

      <a onClick={() => setCreated(false)} className="link-hover">
        Already an account? Go login here!
      </a>

      <button onClick={registerClick} className="btn btn-neutral mt-4 bg-(--nav-color)">
        Register
      </button>
    </fieldset>
  );
}
