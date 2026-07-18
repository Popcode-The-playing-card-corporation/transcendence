import { useEffect, useRef, useState } from "react";
import { friendArray, getFriends } from "../../../api/http/friend";
import { useNotif } from "../../hooks/useNotif";
import type { friendT, requestT } from "../../../utils/type/friendType";
import { useAuth } from "../../hooks/useAuth";
import { inviteFriend } from "../../../api/http/game";

function getRequests(friend_list: friendT[]): {
  friends: friendT[];
  requests: requestT[];
} {
  const friends: friendT[] = [];
  const requests: requestT[] = [];

  for (const friend of friend_list) {
    if (friend.can_accept || friend.status === "pending") {
      requests.push({ id: friend.id, username: friend.user.username });
    } else {
      friends.push(friend);
    }
  }
  return { friends: friends, requests: requests };
}

export default function InviteYourFriends() {
  const showFriendsList = useRef<HTMLDialogElement>(null);
  const [friends, setFriends] = useState<friendT[] | null>(null);
  const [valid, setValid] = useState<boolean | null>(null);
  const notif = useNotif();
  const auth = useAuth();
  const [invites, setInvites] = useState<number[]>([]);

  useEffect(() => {
    function login_error(title: string, message: string) {
      if (!auth.logging) {
        notif?.showNotif(title, message, 5000);
      }
      setValid(false);
      return;
    }

    function other_error(title: string, message: string) {
      notif?.showNotif(title, message, 5000);
      setValid(false);
      return;
    }

    async function getFriendList() {
      const friendlist = await getFriends();
      if ("code" in friendlist) {
        if (friendlist.code === 401) {
          return login_error("Authentication error:", "Please try again.");
        } else {
          return other_error(
            "Error " + friendlist.code + ":",
            friendlist.response,
          );
        }
      }
      const tmp_list = getRequests(friendArray(friendlist)).friends;
      setFriends(tmp_list);

      setValid(true);
    }
    getFriendList();
  }, [notif, auth.logging]);

  if (valid === null) {
    return (
      <div className="page-content flex items-center justify-center min-h-screen">
        <span className="loading loading-spinner loading-xl"></span>
      </div>
    );
  }

  if (!valid) {
    return;
  }

  async function sendInvite(friendID: number) {
    if (invites.includes(friendID)) return;
    const res = await inviteFriend(friendID);
    if ("code" in res) {
      notif?.showNotif("Invite Error", res.response, 5000);
    } else {
      setInvites((prev) => [...prev, friendID]);
    }
  }

  function handleJoin() {
    setInvites([]);
    showFriendsList.current?.showModal();
  }

  return (
    <div className="flex justify-center">
      <button className="btn bg-base-100" onClick={handleJoin}>
        Invite your friends
      </button>
      <dialog id="showFriendsList" className="modal" ref={showFriendsList}>
        <div className="modal-box bg-(--nav-color) w-1/4">
          <table className="table">
            <tr>
              <thead>
                <th>Invite your friends</th>
              </thead>
            </tr>
            <tbody>
              {friends?.length !== 0 ? (
                friends!.map((friend) => {
                  return (
                    <tr key={friend.id}>
                      <td>{friend.user.username}</td>
                      <td>
                        <button
                          className="swap btn"
                          onClick={() => sendInvite(friend.id)}
                        >
                          {!invites.includes(friend.id) ? "Invite" : "Sent"}
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <td>You don't have any friends, go make some !</td>
              )}
            </tbody>
          </table>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button></button>
        </form>
      </dialog>
    </div>
  );
}
