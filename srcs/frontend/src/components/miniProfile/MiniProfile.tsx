import { MiniHistory } from "./MiniHistory";
import DeleteBtn from "../utils/DeleteBtn";
import AddFriendsBtn from "../Profile/AddFriendsBtn";
import BlockBtn from "../utils/BlockBtn";
import type { profileT } from "../../utils/type/profileType";
import type { historyT } from "../../utils/type/historyType";
import type { errorT } from "../../utils/type/errorType";
import { useEffect, useState } from "react";
import type { friendT, requestT } from "../../utils/type/friendType";
import { friendArray, getFriends } from "../../api/http/friend";
import { useAuth } from "../hooks/useAuth";
import { changeHandler } from "../../api/http/friend";
import { RxCheck, RxCross2 } from "react-icons/rx";
import { useNotif } from "../hooks/useNotif";

type Props = {
  account: profileT | errorT;
  updatedFriends?: boolean;
  setUpdate?: React.Dispatch<React.SetStateAction<boolean>>;
  history: historyT[] | errorT;
  profileRef: React.RefObject<HTMLDialogElement | null>
};

function getRequests(friend_list: friendT[]): {
  friends: friendT[];
  requests: requestT[];
} {
  const friends: friendT[] = [];
  const requests: requestT[] = [];

  for (const friend of friend_list) {
    if (friend.can_accept) {
      requests.push({ id: friend.id, username: friend.user.username });
    } else {
      friends.push(friend);
    }
  }
  return { friends: friends, requests: requests };
}

export default function MiniProfile({ account, updatedFriends, setUpdate, history, profileRef }: Props) {

  const [dummy, setDummy] = useState<boolean>(false);
  const [can_accept, setAccept] = useState<boolean>(false);
  const auth = useAuth();
  const notif = useNotif();

  if (!updatedFriends) updatedFriends = dummy;
  if (!setUpdate) setUpdate = setDummy;

  useEffect(() => {
    async function getRequested(checkName: string) {
      const friendlist = await getFriends();
      if ("code" in friendlist) {
        auth.setHasFriendRequest(false);
        return;
      }
      const arr = friendArray(friendlist);
      const filter = getRequests(arr);
      const check = filter.requests.filter(user => user.username === checkName);
      if (check.length > 0) {
        setAccept(true);
      } else {
        setAccept(false);
      }
    }

    if (!('code' in account)) {
      getRequested(account.username);
    }
  }, [account, auth])

  if ('code' in account)
    return;

  return (
    <>
      <div className="modal-box w-full max-w-4/7">
        <p className="text-center ">click ESC to close this window</p>
        <div className="flex">
          <div className="avatar flex-col">
            <div className="avatar mt-8 rounded-4xl w-24">
              <img src={account.avatar}></img>
            </div>
            <p className="text-success font-extrabold my-2 mx-auto">
              {account.is_online && account.friend ? "Online" : ""}
            </p>
          </div>
          <div className="w-full flex justify-end">
            <div >
              {account.friend?.status === "accepted" ?
                <DeleteBtn req_id={account.friend.id} updatedFriends={updatedFriends} setUpdate={setUpdate} profileRef={profileRef} />
                : (
                  account.friend?.status === "pending" ? (
                    can_accept ? (
                      <div className="btn-accept-or-reject flex ">
                        <p className="flex items-center pr-2">Friend request received : </p>
                        <button
                          className="btn validate"
                          onClick={() => changeHandler(account.friend.id, "accept", updatedFriends, setUpdate, null, notif)}
                        >
                          <RxCheck />
                        </button>
                        <button
                          className="btn del"
                          onClick={() => changeHandler(account.friend.id, "delete", updatedFriends, setUpdate, null, notif)}
                        >
                          <RxCross2 />
                        </button>
                      </div>
                    )
                      : (<div className="flex gap-3">
                        <p className="flex items-center">Friend request sent : </p>
                        <button
                          className="btn del"
                          onClick={() => changeHandler(account.friend.id, "delete", updatedFriends, setUpdate, null, notif)}
                        >
                          <RxCross2 />
                        </button>
                      </div>)
                  )
                    : <AddFriendsBtn req_id={account.id} updatedFriends={updatedFriends} setUpdate={setUpdate} profileRef={profileRef} />
                )
              }
            </div>
            <BlockBtn req_id={account.id} updatedFriends={updatedFriends} setUpdate={setUpdate} profileRef={profileRef} />
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
          <MiniHistory history={history} updatedProfile={updatedFriends} setUpdate={setUpdate} />
        </div>
      </div >
      <form method="dialog" className="modal-backdrop">
        <button ></button>
      </form>
    </>
  );
}

