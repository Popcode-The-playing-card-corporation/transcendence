import { TbPointFilled } from "react-icons/tb";
import type { friendT, requestT } from "../utils/friendType";
import {
  acceptRequest,
  deleteRequest,
  denyRequest,
  friendArray,
  getFriends,
} from "../api/friend";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import type { errorT } from "../utils/errorType";
import { refreshAuth } from "../api/checkAuth";
import { IoNotificationsOutline, IoSearch } from "react-icons/io5";
import { FaPlus, FaRegTrashAlt } from "react-icons/fa";
import { RxCheck, RxCross2 } from "react-icons/rx";
import { AddFriends } from "./AddFriends";

export function Friends() {

  const [friends, setFriends] = useState<friendT[] | errorT>({
    code: 0,
    response: "",
  });
  const navigate = useNavigate();
  const [requests, setRequests] = useState<requestT[] | null>(null);
  const [updatedFriends, setUpdate] = useState(false);
  const addFriendsRef = useRef<HTMLDialogElement>(null);
  const [search, setSearch] = useState<string>("")

  function getRequests(friend_list:friendT[]) : {friends:friendT[], requests:requestT[]} {
	const friends:friendT[] = [];
	const requests:requestT[] = [];
	for (const friend of friend_list) {
		if (friend.can_accept) {
			requests.push({id: friend.id, username: friend.user.username});
		} else {
			friends.push(friend);
		}
	}
	return {friends: friends, requests: requests};
  }


  useEffect(() => {
    async function retrieveFriends() {
      let res = await getFriends();
      if ("code" in res) {
        if (res.code === 401) {
          if (!(await refreshAuth())) {
            navigate("/login");
          }
          res = await getFriends();
        }
        if ("code" in res) {
          setFriends(res);
        } else {
          const arr = friendArray(res);
		  const filter = getRequests(arr);
	      setRequests(filter.requests);
		  setFriends(filter.friends);
        }
      } else {
        const arr = friendArray(res);
		const filter = getRequests(arr);
		setRequests(filter.requests);
		setFriends(filter.friends);
      }
    }
    retrieveFriends();
  }, [navigate, updatedFriends]);


  if ("code" in friends) {
    return <p>Error: {String(friends.response)}</p>;
  }

  if (requests === null) {
	return <p>Error: I'm not sure how you got here...</p>;
  }

  async function changeHandler(req_id: number, func: string) {
    if (func === "accept") {
      const res = await acceptRequest(req_id);
      if ("code" in res) {
        console.error(res.response);
      }
    } else if (func === "deny") {
      const res = await denyRequest(req_id);
      if ("code" in res) {
        console.error(res.response);
      }
    } else if (func === "delete") {
      const res = await deleteRequest(req_id);
      if ("code" in res) {
        console.error(res.response);
      }
    }
    setUpdate(!updatedFriends);
    return;
  }
  
  const searchedFriends = friends.filter((friend) => {
	  if (!search) return true;
	  const lower = search.toLocaleLowerCase();
	  return (friend.user.username.toLocaleLowerCase().includes(lower))
  })

  return (
    <div className="friend-part min-h-70">
      <div className="action-container flex justify-between">
        <label className="input my-5">
          <IoSearch className="text-2xl" />
          <input type="search" required placeholder="Search" value={search} onChange={(e) => setSearch(e.target.value)}/>
        </label>
        <div className="btn-container my-5 flex justify-end gap-1">
          <button className="btn" onClick={() => addFriendsRef.current?.showModal()}>
            {" "}
            <FaPlus />{" "}
          </button>
          <dialog id="add_new_friends" className="modal" ref={addFriendsRef}>
		  <AddFriends />
          </dialog>
          <div className="dropdown dropdown-end">
            <div className="indicator">
              <span className="indicator-item badge bg-(--nav-color)">
                {requests.length}
              </span>
              <div tabIndex={0} className="btn" role="button">
                <IoNotificationsOutline />
              </div>
            </div>
            <ul
              tabIndex={-1}
              className="dropdown-content bg-(--hover-color) rounded-box z-1 p-2 shadow-sm h-fit overflow-scroll"
            >
              {requests.map((request: { id: number; username: string }) => {
                return (
                  <li className="flex w-full my-3" key={request.id}>
                    <div className="flex gap-6 w-full">
                      <div className="username-request flex items-center w-2/3">
                        <p>{request.username}</p>
                      </div>
                      <div className="btn-accept-or-reject flex gap-3">
                        <button
                          className="btn btn-circle validate"
                          onClick={() => changeHandler(request.id, "accept")}
                        >
                          <RxCheck />
                        </button>
                        <button
                          className="btn btn-circle del"
                          onClick={() => changeHandler(request.id, "deny")}
                        >
                          <RxCross2 />
                        </button>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
      <table className="">
        <tr>
          <th className="w-10 text-left"></th>
          <th className="w-50 text-left">Name</th>
          <th className="w-30 text-left">Status</th>
          <th className="w-30 text-left">From</th>
        </tr>
        {searchedFriends.map((friend: friendT) => (
          <tr className="h-14">
            <td
              className={
                (friend.user.is_online ? "text-green-400" : "") +
                " text-2xl text-center"
              }
            >
              <TbPointFilled />
            </td>
            <td>{friend.user.username}</td>
            <td>{friend.status}</td>
            <td>
              {friend.status === "pending"
                ? friend.created_at
                : friend.accepted_at}
            </td>
            <td>
              <button onClick={() => changeHandler(friend.id, "delete")} className="btn del ">
                {" "}
                <FaRegTrashAlt />{" "}
              </button>
            </td>
          </tr>
        ))}
      </table>
    </div>
  );
}
