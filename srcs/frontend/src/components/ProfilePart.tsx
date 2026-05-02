import { profileRequest } from "../api/profile";
import type { accountT } from "../utils/accountType";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export function ProfilePart({ accountCurr }: { accountCurr: accountT }) {

	const [failure, setFailure] = useState(false);
	const [success, setSuccess] = useState(false);
	const navigate = useNavigate();

	async function getProfile() {
		setFailure(false);
		setSuccess(false);
		accountCurr = await profileRequest();
		if (accountCurr.username === "") {
			setFailure(true);
			return ;
		}
		setSuccess(true);
		return ;
	}

	if(!success && !failure) {
		getProfile();
	}
	
	if (failure) {
		navigate('/login')
	}
  return (
    <div>
      <div className="avatar mt-8 flex-col">
        <div className="rounded-4xl w-24">
          <img src={accountCurr.avatar} />
        </div>
        <p className="text-green-200 font-extrabold my-2 mx-auto">
          {accountCurr.is_online ? "Online" : ""}
        </p>
      </div>
      <table className="mt-5">
        <tr>
          <th className="th-profile">Username:</th>
          <td>{accountCurr.username}</td>
        </tr>
        <tr>
          <th className="th-profile">Email:</th>
          <td>{accountCurr.mail}</td>
        </tr>
        <tr>
          <th className="th-profile">Password:</th>
          <td>*******<a className="link"> change</a></td>
        </tr>
        <tr>
          <th className="th-profile">Joined on:</th>
          <td>{accountCurr.date_joined}</td>
        </tr>
        <tr>
          <th className="th-profile">Last login:</th>
          <td>{accountCurr.is_online ? "now" : accountCurr.last_login}</td>
        </tr>
      </table>
    </div>
  );
}
