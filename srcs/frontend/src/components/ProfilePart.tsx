import { profileRequest } from "../api/profile";
import type { accountT } from "../utils/accountType";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import type { errorT } from "../utils/errorType";

export function ProfilePart() {

	// const [failure, setFailure] = useState(false);
	// const [success, setSuccess] = useState(false);
	const [realAccount, setAccount] = useState< accountT | errorT>({code: 0, response: ''});
	const navigate = useNavigate();

	useEffect(() => {

		async function getProfile() {
			const result = await profileRequest();
			if ("code" in result) {
				setAccount(result);
				return ;
			}
			setAccount(result);
			return ;
		}

		getProfile();
	
	}, [navigate]);

	if ('code' in realAccount) {
		if (realAccount.code === 401) {
			localStorage.removeItem('access');
			localStorage.removeItem('refresh');
			navigate('/login');
			return ;
		}
		return <p>Error: {realAccount.response}</p>; // improve message
	}



  return (
    <div>
      <div className="avatar mt-8 flex-col">
        <div className="rounded-4xl w-24">
          <img src={realAccount.avatar} />
        </div>
        <p className="text-green-200 font-extrabold my-2 mx-auto">
          {realAccount.is_online ? "Online" : ""}
        </p>
      </div>
      <table className="mt-5">
        <tr>
          <th className="th-profile">Username:</th>
          <td>{realAccount.username}</td>
        </tr>
        <tr>
          <th className="th-profile">Email:</th>
          <td>{realAccount.email}</td>
        </tr>
        <tr>
          <th className="th-profile">Password:</th>
          <td>
            *******<a className="link"> change</a>
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
