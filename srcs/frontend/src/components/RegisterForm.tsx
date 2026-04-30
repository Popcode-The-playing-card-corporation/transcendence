import type { Dispatch, SetStateAction } from "react";

export function RegisterForm({
  setCreated,
}: {
  setCreated: Dispatch<SetStateAction<boolean>>;
}) {
  return (
    <fieldset className="fieldset bg-(--bg-color) border-(--accent-color) rounded-box w-xs border p-4 mx-auto">
      <legend className="fieldset-legend">Register</legend>

      <label className="label">Username</label>
      <input type="email" className="input" placeholder="Username" />

      <label className="label">Email</label>
      <input type="email" className="input" placeholder="Email" />

      <label className="label">Password</label>
      <input type="password" className="input" placeholder="Password" />

      <label className="label">Confirm password</label>
      <input type="password" className="input" placeholder="Password, again" />

      <a onClick={() => setCreated(false)} className="link-hover">
        Already an account? Go login here!
      </a>

      <button className="btn btn-neutral mt-4 bg-(--nav-color)">
        Register
      </button>
    </fieldset>
  );
}
