import React, { useState } from "react";
import { changePassword } from "../../api/http/profile";
import type { errorT } from "../../utils/type/errorType";
import { useNotif } from "../hooks/useNotif";


export function PswdChange({dialogRef}:{dialogRef:React.RefObject<HTMLDialogElement| null>}) {

	const [oldpass, setOld] = useState("");
	const [password1, setPassword1] = useState("");
	const [password2, setPassword2] = useState("");
	const oldChange = (e: React.ChangeEvent<HTMLInputElement>) => {setOld(e.target.value);};
	const pass1Change = (e: React.ChangeEvent<HTMLInputElement>) => {setPassword1(e.target.value);};
	const pass2Change = (e: React.ChangeEvent<HTMLInputElement>) => {setPassword2(e.target.value);};
	const [reason, setReason] = useState<errorT>({code:200,response:""});
	const notif = useNotif();
	
	function clean_close() {
		setOld("");
		setPassword1("");
		setPassword2("");
		setReason({code:200, response:""});
		dialogRef.current?.close();
    }

	function validate_inputs(old_pass:string, pass1:string, pass2:string) {

		if (old_pass.length === 0 || pass1.length === 0 || pass2.length === 0) {
			setReason({code: -1, response: "All fields must be filled!"});
			return false;
		} else if (pass1 !== pass2){
			setReason({code: -1, response: "New passwords must match!"});
			return false;
		} else if (pass1.length < 8) {
			setReason({code: -1, response: "New password must be at least 8 characters!"})
			return false;
		} else if (!(/[A-Z]/.test(pass1)) || !(/[a-z]/.test(pass1)) || !/[^a-zA-Z0-9]/.test(pass1)) {
			setReason({code: -1, response: "New password must contain at least: 1 uppercase, 1 lowercase and 1 special character"})
			return false;
		} else if (pass1 == old_pass) {
			setReason({code: -1, response: "New password cannot be the same as old password!"});
			return false;
		}
		return true;
	}

	  async function updatePass(old_pass:string, pass1:string, pass2:string) {
		setReason({code:200, response:""});

		const check = validate_inputs(old_pass, pass1, pass2);
		if (!check) {
			return ;
		}
		const res = await changePassword(old_pass, pass1, pass2);
		if (res.code !== 200) {
			setReason(res);
			notif?.showNotif("Username change error:", res.response, 5000);
			clean_close();
			return ;
		}
		clean_close();
		return ;
	  }

  return (
    <div className="modal-box">
      <h3 className="text-lg font-bold text-center">Change password</h3>
      <p className="py-4 text-center">Enter your password and choose your new one</p>
	  {reason.code === -1 ? <p className="py-4 text-center">{String(reason.response)}</p> : ""}
	  {reason.code !== 200 && reason.code !== -1 ? <p className="py-4 text-center"> {"Unknown Error: " + String(reason.response)}</p> : ""}
      <div className="modal-action">
        <fieldset className="fieldset border-accent rounded-box w-xs border p-4 mx-auto">
          <legend className="fieldset-legend">Change password</legend>

          <label className="label">Old password</label>
          <input type="password" value={oldpass} onChange={oldChange} className="input" placeholder="..." />

          <label className="label">New password</label>
          <input type="password" value={password1} onChange={pass1Change} className="input" placeholder="..." />
          <label className="label">Confirm new password</label>
          <input
            type="password"
			value={password2}
			onChange={pass2Change}
            className="input"
            placeholder="..."
          />

          <form method="dialog" className="flex justify-around">
            <button type="button" onClick={() => updatePass(oldpass, password1, password2)} className="btn mt-4">Change</button>
            <button type="button" onClick={() => clean_close()} className="btn  mt-4">Cancel</button>
          </form>
        </fieldset>
      </div>
    </div>
  );
}
