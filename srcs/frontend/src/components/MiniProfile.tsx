import { FaPlus, FaRegTrashAlt } from "react-icons/fa";
import { generateFakeAccount } from "../utils/test_funcs/generateTestAccount";
import { MiniHistory } from "./MiniHistory";

export default function MiniProfile() {
  const fakeAccount = generateFakeAccount();
  fakeAccount.is_friend = true;

  return (
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
          <button className={"btn " + (fakeAccount.is_friend ? "del" : "")}  >
            {fakeAccount.is_friend ? <FaRegTrashAlt /> : <FaPlus />}
          </button>
        </div>
      </div>
      <table className="mt-5">
        <tr>
          <th className="th-profile">Username:</th>
          <td>{fakeAccount.username}</td>
        </tr>
        <tr>
          <th className="th-profile">Email:</th>
          <td>{fakeAccount.email}</td>
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
  );
}

