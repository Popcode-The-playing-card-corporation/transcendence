import { profileRequest } from "../api/profile";
import type { accountT } from "../utils/accountType";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import type { errorT } from "../utils/errorType";
import { AvatarSelection } from "./AvatarSelection";

export function ProfilePart() {
  // const [failure, setFailure] = useState(false);
  // const [success, setSuccess] = useState(false);
  const [realAccount, setAccount] = useState<accountT | errorT>({
    code: 0,
    response: "",
  });
  const navigate = useNavigate();

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
  }, [navigate]);

  if ("code" in realAccount) {
    if (realAccount.code === 401) {
      localStorage.removeItem("access");
      localStorage.removeItem("refresh");
      navigate("/login");
      return;
    }
    return <p>Error: {realAccount.response}</p>; // improve message
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
          <td>{realAccount.username}</td>
        </tr>
        <tr>
          <th className="th-profile">Email:</th>
          <td>{realAccount.email}</td>
        </tr>
        <tr>
          <th className="th-profile">Password:</th>
          <td>
            *******
            <a className="link" href="#change_pswd_modal">
              {" "}
              change
            </a>
            <div
              className="modal modal-top"
              role="dialog"
              id="change_pswd_modal"
            >
              <div className="modal-box bg-(--bg-color)">
                <h3 className="text-lg font-bold">Change password</h3>
                <p className="py-4">
                  Enter your password and choose your new one
                </p>
                <div className="modal-action">
                  <fieldset className="fieldset bg-(--bg-color) border-(--accent-color) rounded-box w-xs border p-4 mx-auto">
                    <legend className="fieldset-legend">Change password</legend>

                    <label className="label">Old password</label>
                    <input
                      type="password"
                      className="input"
                      placeholder="old password"
                    />

                    <label className="label">New password</label>
                    <input
                      type="password"
                      className="input"
                      placeholder="new password"
                    />
                    <label className="label">Confirm new password</label>
                    <input
                      type="password"
                      className="input"
                      placeholder="confirm new password"
                    />

                    <a className="btn bg-(--nav-color) mt-4" href="#">
                      change
                    </a>
                    <a className="btn bg-(--nav-color) mt-4" href="#">
                      cancel
                    </a>
                  </fieldset>
                </div>
              </div>
            </div>
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
