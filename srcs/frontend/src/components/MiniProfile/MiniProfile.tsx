import { MiniHistory } from "../MiniHistory";
import DeleteBtn from "../DeleteBtn";
import AddFriendsBtn from "../AddFriendsBtn";
import BlockBtn from "../BlockBtn";
import type { profileT } from "../../utils/profileType";
import type { historyT } from "../../utils/historyType";
import type { errorT } from "../../utils/errorType";
import { useState } from "react";

type Props = {
  account: profileT | errorT;
  updatedFriends?: boolean;
  setUpdate?: React.Dispatch<React.SetStateAction<boolean>>;
  logged_in:boolean;
  history: historyT[] | errorT;
  profileRef: React.RefObject<HTMLDialogElement | null>
};

export default function MiniProfile({account, updatedFriends, setUpdate, logged_in, history, profileRef}: Props) {
  
  const [dummy, setDummy] = useState(false);

  if (!updatedFriends) updatedFriends = dummy;
  if (!setUpdate) setUpdate = setDummy;

  if ('code' in account)
	return ;
  return (
    <>
    <div className="modal-box bg-(--nav-color)">
      <p className="text-center ">click ESC for close this window</p>
      <div className="flex">
        <div className="avatar flex-col">
          <div className="avatar mt-8 rounded-4xl w-24">
            <img src={account.avatar}></img>
          </div>
          <p className="text-green-200 font-extrabold my-2 mx-auto">
            {account.is_online && account.friend ? "Online" : ""}
          </p>
        </div>
        <div className="w-full flex justify-end">
          <div >
            {account.friend ? <DeleteBtn req_id={account.friend.id} updatedFriends={updatedFriends} setUpdate={setUpdate} profileRef={profileRef}/> : <AddFriendsBtn req_id={account.id} updatedFriends={updatedFriends} setUpdate={setUpdate} profileRef={profileRef}/>}
          </div>
            <BlockBtn req_id={account.id} updatedFriends={updatedFriends} setUpdate={setUpdate} profileRef={profileRef}/>
        </div>
      </div>
      <table className="mt-5">
        <tr>
          <th className="th-profile">Username:</th>
          <td>{account.username}</td>
        </tr>
        <tr>
          <th className="th-profile">Joined on:</th>
          <td>{account.date_joined}</td>
        </tr>
        {account.friend ? <tr>
          <th className="th-profile">Last login:</th>
          <td>{account.is_online ? "now" : account.last_login}</td>
        </tr> : null}
      </table>
      {/* {* if friend *} 
				 need to modify a lot of thing here like the width of the modal ( surement creer un nouveau component history) */}
      <div className="mt-10">
		<MiniHistory history={history} updatedProfile={updatedFriends} setUpdate={setUpdate} logged_in={logged_in}/>
      </div>
    </div>
      <form method="dialog" className="modal-backdrop">
        <button ></button>
      </form>
    </>
  );
}

