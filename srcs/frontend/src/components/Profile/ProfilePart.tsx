import type { accountT } from "../../utils/type/accountType";
import { useRef } from "react";
import { AvatarSelection } from "./AvatarSelection";
import { PswdChange } from "./PswdChange";
import { PseudoChange } from "./PseudoChange";


export function ProfilePart({realAccount, setUpdate, updatedProfile}:{realAccount:accountT; setUpdate:React.Dispatch<React.SetStateAction<boolean>>; updatedProfile:boolean}) {

  const dialogPswdRef = useRef<HTMLDialogElement>(null);
  const dialogPseudoRef = useRef<HTMLDialogElement>(null);

  return (
    <div>
      <div className="avatar mt-8 flex-col">
        <AvatarSelection currentAvatar={realAccount.avatar} />
        <p className="tex/assets/avatars/t-green-200 font-extrabold my-2 mx-auto">
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
			<PseudoChange dialogRef={dialogPseudoRef} updatedProfile={updatedProfile} setUpdate={setUpdate} old_user={realAccount.username} has_pass={realAccount.has_password}/>
            </dialog>
          </td>
        </tr>
        <tr>
          <th className="th-profile">Email:</th>
          <td>{realAccount.email}</td>
        </tr>
        { realAccount.has_password ? <tr> 
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
              <PswdChange dialogRef={dialogPswdRef} />
            </dialog>
          </td>
        </tr> : null }
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
