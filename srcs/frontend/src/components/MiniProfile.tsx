import { generateFakeAccount } from "../utils/test_funcs/generateTestAccount";
import { MiniHistory } from "./MiniHistory";
import DeleteBtn from "./DeleteBtn";
import AddFriendsBtn from "./AddFriendsBtn";
import BlockBtn from "./BlockBtn";
import type { profileT } from "../utils/profileType";

type Props = {
  id: number;
  updatedFriends: boolean;
  setUpdate: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function MiniProfile({id, updatedFriends, setUpdate}: Props) {
  const fakeAccount = generateFakeAccount();

  return (
    <>
    <div className="modal-box bg-(--nav-color)">
      <p className="text-center ">click ESC for close this window</p>
      <div className="flex">
        <div className="avatar flex-col">
          <div className="avatar mt-8 rounded-4xl w-24">
            <img src={fakeAccount.avatar}></img>
          </div>
          <p className="text-green-200 font-extrabold my-2 mx-auto">
            {fakeAccount.is_online ? "Online" : ""}
          </p>
        </div>
        <div className="w-full flex justify-end">
          <div >
            {fakeAccount.is_friend ? <DeleteBtn req_id={fakeAccount.id} updatedFriends={updatedFriends} setUpdate={setUpdate}/> : <AddFriendsBtn req_id={fakeAccount.id} updatedFriends={updatedFriends} setUpdate={setUpdate}/>}
          </div>
            <BlockBtn req_id={fakeAccount.id} updatedFriends={updatedFriends} setUpdate={setUpdate}/>
        </div>
      </div>
      <table className="mt-5">
        <tr>
          <th className="th-profile">Username:</th>
          <td>{fakeAccount.username}</td>
        </tr>
        <tr>
          <th className="th-profile">Joined on:</th>
          <td>{fakeAccount.date_joined}</td>
        </tr>
        <tr>
          <th className="th-profile">Last login:</th>
          <td>{fakeAccount.is_online ? "now" : fakeAccount.last_login}</td>
        </tr>
      </table>
      {/* {* if friend *} 
				 need to modify a lot of thing here like the width of the modal ( surement creer un nouveau component history) */}
      <div className="mt-10">
		<MiniHistory />
      </div>
    </div>
      <form method="dialog" className="modal-backdrop">
        <button ></button>
      </form>
    </>
  );
}

