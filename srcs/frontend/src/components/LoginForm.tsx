import type { Dispatch, SetStateAction } from "react";

export function LoginForm( {setCreated}: {setCreated : Dispatch<SetStateAction<boolean>>}) {
  return (
    <fieldset className="fieldset bg-(--bg-color) border-(--accent-color) rounded-box w-xs border p-4 mx-auto">
      <legend className="fieldset-legend">Login</legend>

      <label className="label">Email or username</label>
      <input type="email" className="input" placeholder="Email / Username" />

      <label className="label">Password</label>
      <input type="password" className="input" placeholder="Password" />
	  <a onClick={() => setCreated(true)} className="link-hover">No Account? Create one here!</a>

      <button className="btn btn-neutral mt-4 bg-(--nav-color)">Login</button>
    </fieldset>
  );
}
