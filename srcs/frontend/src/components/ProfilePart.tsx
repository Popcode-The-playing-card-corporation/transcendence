import { changeEmail, changePassword, changeUsername, profileRequest } from "../api/profile";
import type { accountT } from "../utils/accountType";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import type { errorT } from "../utils/errorType";
import { AvatarSelection } from "./AvatarSelection";

export function ProfilePart() {
  const [realAccount, setAccount] = useState<accountT | errorT>({
    code: 0,
    response: "",
  });
  const navigate = useNavigate();
  const [updatedProfile, setUpdate] = useState(false);

  useEffect(() => {
    async function getProfile() {
      const result = await profileRequest();
      if ("code" in result) {
        setAccount(result);
        return;
      }
      setAccount(result);
      return;
    }

    getProfile();
  }, [navigate, updatedProfile]);

  if ("code" in realAccount) {
    if (realAccount.code === 401) {
      localStorage.removeItem("access");
      localStorage.removeItem("refresh");
      navigate("/login");
      return;
    }
    return <p>Error: {realAccount.response}</p>; // improve message
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
        <AvatarSelection currentAvatar={realAccount.avatar}/>
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