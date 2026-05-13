import React, { useState } from "react";
import { changeUsername } from "../api/profile";
import type { errorT } from "../utils/errorType";

export function PseudoChange({dialogRef, updatedProfile, setUpdate, old_user}:{dialogRef: React.RefObject<HTMLDialogElement| null>; updatedProfile:boolean; setUpdate:React.Dispatch<React.SetStateAction<boolean>>; old_user:string}) {

	const [name, setName] = useState("");
	const [password, setPassword] = useState("");
	const nameChange = (e: React.ChangeEvent<HTMLInputElement>) => {setName(e.target.value);};
	const passChange = (e: React.ChangeEvent<HTMLInputElement>) => {setPassword(e.target.value);};
	const [reason, setReason] = useState<errorT>({code:200,response:""});

  function validate_inputs (in_name:string, old_pass:string, old_user:string) {
	if (in_name.trim().length === 0 && old_pass.length === 0) {
		return {code:-1, response:"Current password and new username are required fields!"};
	} else if (in_name.trim().length === 0) {
		return {code: -1, response:"New username is a required field!"};
	} else if (old_pass.length === 0) {
		return {code: -1, response:"Current password is a required field!"};
 	} else if (old_user === in_name) {
		return {code: -1, response:"New username cannot be the same as the old username!"};
	}
	return {code:200, response:""};
  }

  function clean_close() {
	setName("");
	setPassword("");
	setReason({code:200, response:""});
	dialogRef.current?.close();
  }

  async function updateUser(in_name:string, old_pass:string, old_user:string) {
	const check = validate_inputs(in_name, old_pass, old_user);
	if (check.code === -1) {
		setReason(check);
		return ;
	}
	const res = await changeUsername(in_name, old_pass);
	if (res.code !== 200) {
		setReason(res);
		return ;
	}
	setUpdate(!updatedProfile);
	clean_close();
	return ;
  }


  return (
    <div className="modal-box bg-(--bg-color)">
      <h3 className="text-lg font-bold text-center">Change username</h3>
      <p className="py-4 text-center">
        Enter your password and choose your new username
      </p>
	    {reason.code === -1 ? <p className="py-4 text-center">{String(reason.response)}</p> : ""}
		{reason.code !== 200 && reason.code !== -1 ? <p className="py-4 text-center"> {"Unknown Error: " + String(reason.response)}</p> : ""}
      <div className="modal-action">
        <fieldset className="fieldset bg-(--bg-color) border-(--accent-color) rounded-box w-xs border-1 p-4 mx-auto">
          <legend className="fieldset-legend">Change username</legend>

          <label className="label">Password</label>
          <input type="password" value={password} onChange={passChange} className="input" placeholder="Your password"/>

          <label className="label">New username</label>
          <input
            type="text"
			value={name}
			onChange={nameChange}
            className="input"
            placeholder="Your new username"
          />
          <form className="flex justify-around">
            <button type="button" onClick={() => updateUser(name, password, old_user)} className="btn bg-(--nav-color) mt-4">Change</button>
            <button type="button" onClick={() => clean_close()} className="btn bg-(--nav-color) mt-4">Cancel</button>
          </form>
        </fieldset>
      </div>
    </div>
  );
}
