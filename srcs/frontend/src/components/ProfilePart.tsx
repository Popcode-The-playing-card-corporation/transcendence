import { changeEmail, changePassword, changeUsername, profileRequest } from "../api/profile";
import type { accountT } from "../utils/accountType";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import type { errorT } from "../utils/errorType";
import { AvatarSelection } from "./AvatarSelection";
import { PswdChange } from "./PswdChange";
import { PseudoChange } from "./PseudoChange";
import { refreshAuth } from "../api/checkAuth";

export function ProfilePart() {
  const [realAccount, setAccount] = useState<accountT | errorT>({
    code: 0,
    response: "",
  });
  const navigate = useNavigate();
  const [updatedProfile, setUpdate] = useState(false);
  const dialogPswdRef = useRef<HTMLDialogElement>(null);
  const dialogPseudoRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    async function getProfile() {
      let result = await profileRequest();

	  if ("code" in result) {
		if (result.code === 401) {
			if (!(await refreshAuth())) {
				navigate('/login');
			}
			result = await profileRequest();
		}
      }
	  setAccount(result);
      return;
    }

    getProfile();
  }, [updatedProfile, navigate]);

  if ("code" in realAccount) {
    return <p>Error: {String(realAccount.response)}</p>; // improve message
  }

  async function updateUser(in_name:string) {
	const res = await changeUsername(in_name);
	if (!res) {
		console.error('user failure');
		return ;
	}
	setUpdate(!updatedProfile);
	return ;
  }

  async function updateEmail(in_email:string) {
	const res = await changeEmail(in_email);
	if (!res) {
		console.error('email failure');
		return ;
	}
	setUpdate(!updatedProfile);
	return ;
  }

  async function updatePass(in_pass:string) {
	const res = await changePassword(in_pass);
	if (!res) {
		console.error('password failure');
		return ;
	}
	setUpdate(!updatedProfile);
	return ;
  }

  return (
    <div>
      <div className="avatar mt-8 flex-col">
        <AvatarSelection currentAvatar={realAccount.avatar} />
        <p className="text-green-200 font-extrabold my-2 mx-auto">
          {realAccount.is_online ? "Online" : ""}
        </p>
      </div>
      <table className="mt-5">
        <tr>
          <th className="th-profile">Username:</th>
          <td>
            {realAccount.username} <button className="link ml-5" onClick={() => dialogPseudoRef.current?.showModal()}>change</button>
            <dialog
              id="change_pseudo_modal"
              className="modal"
              ref={dialogPseudoRef}
            >
			<PseudoChange />
            </dialog>
          </td>
        </tr>
        <tr>
          <th className="th-profile">Email:</th>
          <td>{realAccount.email}</td>
        </tr>
        <tr>
          <th className="th-profile">Password:</th>
          <td>
            *******
            <button
              className="link ml-5"
              onClick={() => dialogPswdRef.current?.showModal()}
            >
              {" "}
              change
            </button>
            <dialog
              id="change_pswd_modal"
              className="modal"
              ref={dialogPswdRef}
            >
              <PswdChange />
            </dialog>
          </td>
        </tr>
        <tr>
          <th className="th-profile">Joined on:</th>
          <td>{realAccount.date_joined}</td>
        </tr>
        <tr>
          <th className="th-profile">Last login:</th>
          <td>{realAccount.is_online ? "now" : realAccount.last_login}</td>
        </tr>
      </table>
    </div>
  );
}