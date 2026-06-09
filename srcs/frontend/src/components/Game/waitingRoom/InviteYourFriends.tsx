import { useEffect, useRef, useState} from "react";
import { friendArray, getFriends } from "../../../api/http/friend";
import { useNavigate } from "react-router";
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
      if (friend.can_accept) {
        requests.push({ id: friend.id, username: friend.user.username });
      } else {
        friends.push(friend);
      }
    }
    return { friends: friends, requests: requests };
  }

export default function InviteYourFriends() {
  const showFriendsList = useRef<HTMLDialogElement>(null);
	const [friends, setFriends] = useState<friendT[]>([]);
	const [valid, setValid] = useState<boolean | null>(null);
	const navigate = useNavigate();
	const notif = useNotif();
	const auth = useAuth();

  useEffect(() => {

		function login_error(title:string, message:string) {
			if (!auth.logging) {
				navigate('/login', {state: "/profile"});
				notif?.showNotif(title, message, 5000);
			}
			setValid(false);
			return ;
		}

		function other_error(title:string, message:string) {
			navigate('/', {state: "/profile"});
			notif?.showNotif(title, message, 5000);
			setValid(false);
			return ;
		}

    async function getFriendList() {
      const friendlist = await getFriends();
			if ("code" in friendlist) {
				if (friendlist.code === 401) {
					return login_error("Authentication error:", "Please log in again.");
				} else {
					return other_error("Error " + friendlist.code + ":", friendlist.response);
				}
			}

			setFriends(getRequests(friendArray(friendlist)).friends);

      setValid(true);
    }
    getFriendList();
  }, [navigate, notif, auth.logging])

	if (valid === null) {
		return (
			<div className="page-content flex items-center justify-center min-h-screen">
				<span className="loading loading-spinner loading-xl"></span>
			</div>
		)
	}

	if (!valid) {
		return ;
	}

	async function sendInvite(friendID:number) {
		const res = await inviteFriend(friendID);
		if ("code" in res) {
			notif?.showNotif("Invite Error", res.response, 5000);
		}
	}

  return (
    <div className="flex justify-center">
      <button
        className="btn "
        onClick={() => showFriendsList.current?.showModal()}
      >
        Invite your friends
      </button>
      <dialog id="showFriendsList" className="modal" ref={showFriendsList}>
        <div className="modal-box bg-(--nav-color) w-1/4">
          <table className="table">
            <thead>
              <th>Invite your friends</th>
            </thead>
            <tbody>
              {friends.map((friend) => (
                <tr>
                  <td>
                    {friend.user.username}
                  </td>
                  <td>
                    <label className="swap btn">
                      <input type="checkbox" />
                      <div className="swap-off fill-current" onClick={() => sendInvite(friend.id)}>
                        Invite
                      </div>
                      <div className="swap-on fill-current">
                        Sent
                      </div>
                    </label>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      <form method="dialog" className="modal-backdrop">
        <button ></button>
      </form>
      </dialog>
    </div>
  );
}