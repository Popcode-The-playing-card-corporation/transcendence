import React, { useRef, useState, type KeyboardEvent } from "react";
import { changeUsername } from "../../api/http/profile";
import { type errorT } from "../../utils/type/errorType";
import { useNotif } from "../hooks/useNotif";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export function PseudoChangeResponsive({ dialogRef, updatedProfile, setUpdate, old_user, has_pass }: { dialogRef: React.RefObject<HTMLDialogElement | null>; updatedProfile: boolean | null; setUpdate: React.Dispatch<React.SetStateAction<boolean>> | null; old_user: string | null, has_pass: boolean }) {

  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const nameChange = (e: React.ChangeEvent<HTMLInputElement>) => { setName(e.target.value); };
  const passChange = (e: React.ChangeEvent<HTMLInputElement>) => { setPassword(e.target.value); };
  const [reason, setReason] = useState<errorT>({ code: 200, response: "" });
  const notif = useNotif();
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  function validate_inputs(in_name: string, old_pass: string, old_user: string | null) {
    if (in_name.trim().length === 0 && (old_pass.length === 0 && has_pass)) {
      return { code: -1, response: "Current password and new username are required fields!" };
    } else if (in_name.trim().length === 0) {
      return { code: -1, response: "New username is a required field!" };
    } else if (old_pass.length === 0 && has_pass) {
      return { code: -1, response: "Current password is a required field!" };
    } else if (old_user === in_name) {
      return { code: -1, response: "New username cannot be the same as the old username!" };
    }
    return { code: 200, response: "" };
  }

  function clean_close() {
    setName("");
    setPassword("");
    setReason({ code: 200, response: "" });
    dialogRef.current?.close();
    setShowPassword(false);
  }

  async function updateUser(in_name: string, old_pass: string, old_user: string | null) {
    const check = validate_inputs(in_name, old_pass, old_user);
    if (check.code === -1) {
      setReason(check);
      return;
    }
    const res = await changeUsername(in_name, old_pass, has_pass);
    if (res.code !== 200) {
      setReason(res);
      notif?.showNotif("Username change error:", res.response, 5000);
      clean_close();
      return;
    }
    if (setUpdate) {
      setUpdate(!updatedProfile);
    }
    clean_close();
    return;
  }

  const handleKey = (event: KeyboardEvent) => {
    if (event.key === "Enter")
      buttonRef.current?.click();
  };

  return (
    <div className="modal-box">
      <h3 className="text-lg font-bold text-center">Change username</h3>
      <p className="py-4 text-center">
        {has_pass ? "Enter your password and choose your new username" : "Choose your new username"}
      </p>
      {reason.code === -1 ? <p className="py-4 text-center text-error font-black">{String(reason.response)}</p> : ""}
      {reason.code !== 200 && reason.code !== -1 ? <p className="py-4 text-center"> {"Unknown Error: " + String(reason.response)}</p> : ""}
      <div className="modal-action">
        <fieldset className="fieldset bg-(--bg-color) border-(--accent-color) rounded-box w-xs border p-4 mx-auto">
          <legend className="fieldset-legend">Change username</legend>

          {has_pass ?
            <>
              <p>Password</p>
              <label className="label">
                <div className="input w-full">
                  <input
                    id="pswdChangeResponsive"
                    name="pswdChange"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={passChange}
                    placeholder="Your password"
                    onKeyDown={handleKey}
                  />
                  <button className="cursor-pointer " onClick={() => setShowPassword(!showPassword)}>{showPassword ? <FaEyeSlash /> : <FaEye />}</button>
                </div>
              </label>
            </>
            : null
          }

          <p>New username</p>
          <label className="label">
            <input
              id="usernameChangeResponsive"
              name="usernameChange"
              type="text"
              value={name}
              onChange={nameChange}
              className="input"
              placeholder="Your new username"
              onKeyDown={handleKey}
            />
          </label>
          <form className="flex justify-around">
            <button ref={buttonRef} type="button" onClick={() => updateUser(name, password, old_user)} className="btn mt-4">Change</button>
            <button type="button" onClick={() => clean_close()} className="btn mt-4">Cancel</button>
          </form>
        </fieldset>
      </div>
    </div>
  );
}
